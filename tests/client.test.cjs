const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const acorn = require('acorn');

function namedFunction(file, name, globals={}) {
    const source=fs.readFileSync(file,'utf8');
    let found;
    function visit(node) {
        if(!node || typeof node!=='object') return;
        if(node.type==='FunctionDeclaration' && node.id.name===name) found=node;
        for(const value of Object.values(node)) {
            if(Array.isArray(value)) value.forEach(visit);
            else if(value && typeof value==='object') visit(value);
        }
    }
    visit(acorn.parse(source,{ecmaVersion:'latest'}));
    assert.ok(found, name);
    return vm.runInNewContext('('+source.slice(found.start,found.end)+')',{URL,URLSearchParams,...globals});
}

function memoryStorage(entries=[]) {
    const values=new Map(entries);
    return {
        getItem:key=>values.has(key)?values.get(key):null,
        setItem:(key,value)=>values.set(key,String(value)),
        removeItem:key=>values.delete(key),
        values
    };
}

function authContext({api=false,products=[],users=[]}={}) {
    const localStorage=memoryStorage([
        ['luddies.catalog_products',JSON.stringify(products)],
        ['luddies.catalog_initialized','1']
    ]);
    const sessionStorage=memoryStorage();
    const window={
        __LUDDIES_CONFIG_LOADED__:true,
        LuddiesConfig:{apiBaseUrl:api?'https://luddies.test':''},
        LUDDIES_CATALOG_SEED:[{id:'1',name:'seed',custom:false,purchasable:1}],
        LuddiesCatalogApi:{mapApiProductToClient:value=>value},
        LuddiesApi:{
            uses:()=>api,
            getJson:path=>Promise.resolve(path==='/api/users'?users:[]),
            postJson:()=>Promise.resolve(),
            delete:()=>Promise.resolve(),
            putJson:()=>Promise.resolve()
        }
    };
    const context={window,localStorage,sessionStorage,location:{hostname:'luddies.test'},console,Promise,Date,URL,URLSearchParams};
    vm.runInNewContext(fs.readFileSync('client/js/luddies-storage-keys.js','utf8'),context);
    vm.runInNewContext(fs.readFileSync('client/js/auth.js','utf8'),context);
    return {window,localStorage,sessionStorage};
}

test('login only returns to same-origin HTTP pages without double decoding',()=>{
    const run=value=>namedFunction('client/js/login.js','getReturnUrl',{window:{location:{search:'?return='+encodeURIComponent(value),origin:'https://luddies.test',href:'https://luddies.test/html/login.html'}}})();
    assert.equal(run('https://evil.test'),'index.html');
    assert.equal(run('javascript:alert(1)'),'index.html');
    assert.equal(run('//evil.test'),'index.html');
    assert.equal(run('/html/catalog.html?search=hello%20world'),'https://luddies.test/html/catalog.html?search=hello%20world');
});

test('money preserves centavos and rejects non-price text',()=>{
    const context={window:{LuddiesI18n:{getLang:()=> 'es'}}};
    vm.runInNewContext(fs.readFileSync('client/js/money.js','utf8'),context);
    const money=context.window.LuddiesMoney;
    assert.equal(money.parsePrice('Desde $1,299.50 MXN'),1299.5);
    assert.ok(Number.isNaN(money.parsePrice('Consultar')));
    assert.equal(money.formatTotal(199.5),'$199.50 MXN');
});

test('admin product payload and checkout share the same monetary amount',()=>{
    const context={window:{LuddiesI18n:{getLang:()=> 'en'}}};
    vm.runInNewContext(fs.readFileSync('client/js/money.js','utf8'),context);
    vm.runInNewContext(fs.readFileSync('client/js/catalog-api-mapper.js','utf8'),context);
    const form={labels:{
        es:{name:'Producto',description:'Descripción',meta:'Meta',price:'Desde $1,299.50 MXN'},
        en:{name:'Product',description:'Description',meta:'Meta',price:'From $1,299.50 MXN'}
    },img:'image.webp',category:'science',purchasable:1};
    const payload=context.window.LuddiesCatalogApi.mapFormDataToProductPayload(form,null);
    const saved=context.window.LuddiesCatalogApi.mapApiProductToClient({...payload,id:42},['science']);
    assert.equal(payload.priceAmount,1299.5);
    assert.equal(context.window.LuddiesMoney.parsePrice(saved.labels.en.price),1299.5);
});

test('an empty API catalog replaces stale cached products',async()=>{
    const state=authContext({api:true,products:[{id:'stale'}]});
    const products=await state.window.LuddiesAuth.loadProducts();
    assert.deepEqual(Array.from(products),[]);
    assert.deepEqual(JSON.parse(state.localStorage.getItem('luddies.catalog_products')),[]);
});

test('deleted demo seed products stay deleted after initialization',async()=>{
    const state=authContext({api:false,products:[{id:'1',name:'seed',custom:false,purchasable:1}]});
    const result=await state.window.LuddiesAuth.deleteProduct('1');
    assert.equal(result.ok,true);
    state.window.LuddiesAuth.init();
    assert.deepEqual(Array.from(state.window.LuddiesAuth.getProducts()),[]);
});

test('API user data remains in memory and is cleared on logout',async()=>{
    const state=authContext({api:true,users:[{id:7,fullName:'Private User',email:'private@example.test',role:{name:'USER'}}]});
    await state.window.LuddiesAuth.loadUsers();
    assert.equal(state.window.LuddiesAuth.getUsers()[0].email,'private@example.test');
    assert.equal(state.localStorage.getItem('luddies.users'),null);
    await state.window.LuddiesAuth.logout();
    assert.deepEqual(Array.from(state.window.LuddiesAuth.getUsers()),[]);
});

test('a 401 response removes stale session and administrative data',async()=>{
    const localStorage=memoryStorage([
        ['luddies.session','{"userId":"7"}'],
        ['luddies.users','[{"email":"private@example.test"}]']
    ]);
    const context={
        window:{LuddiesConfig:{apiBaseUrl:'https://luddies.test'}},
        localStorage,
        document:{dispatchEvent(){}},
        CustomEvent:function CustomEvent(){},
        fetch:()=>Promise.resolve({ok:false,status:401,statusText:'Unauthorized',text:()=>Promise.resolve('{"error":"authentication_required"}')})
    };
    vm.runInNewContext(fs.readFileSync('client/js/luddies-api.js','utf8'),context);
    await assert.rejects(context.window.LuddiesApi.getJson('/api/users'),error=>error.status===401);
    assert.equal(localStorage.getItem('luddies.session'),null);
    assert.equal(localStorage.getItem('luddies.users'),null);
});

test('expiry rejects malformed and expired inputs',()=>{
    const validate=namedFunction('client/js/payment.js','isValidExpiry');
    for(const value of ['','12/xx','ab/99','00/99','13/99','01/20','1/99']) assert.equal(validate(value),false,value);
    assert.equal(validate('12/99'),true);
});

test('payment demo never persists paid orders or sends confirmation email',()=>{
    const source=fs.readFileSync('client/js/payment.js','utf8');
    assert.doesNotMatch(source,/submitPaidOrder|sendOrderConfirmation|emailjs\.send/);
    assert.match(source,/input\.readOnly = true/);
    assert.match(source,/if \(btnPay.disabled\) return/);
});

test('checkout dependencies load before consumers and support keyboard submission',()=>{
    for (const page of ['checkout','payment']) {
        const html=fs.readFileSync('client/html/'+page+'.html','utf8');
        assert.ok(html.indexOf('../js/money.js')>=0);
        assert.ok(html.indexOf('../js/money.js')<html.indexOf('../js/'+page+'.js'));
    }
    assert.match(fs.readFileSync('client/js/checkout.js','utf8'),/form.addEventListener\("submit"/);
});

test('demo completion changes view once without leaking personal or card data into receipt',()=>{
    const elements=new Map();
    const listeners={};
    const storage=new Map([['luddies.payment_stub',JSON.stringify({email:'qa@example.test',name:'Quality Test'})]]);
    const element=id=>{
        if(!elements.has(id)) elements.set(id,{
            hidden:id==='payment-success-view', value:'', textContent:'', disabled:false,
            classList:{toggle(){}},setAttribute(){},setCustomValidity(){},reportValidity(){},
            addEventListener(event,fn){this[event]=fn;}
        });
        return elements.get(id);
    };
    let cleared=0;
    const context={Date,Math,JSON,
        document:{getElementById:element,addEventListener:(event,fn)=>{listeners[event]=fn;}},
        sessionStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},
        window:{LuddiesI18n:{getLang:()=> 'es',t:key=>key==='price'?'$199 MXN':key},
            LuddiesCatalogCart:{readCart:()=>cleared?[]:[{priceKey:'price'}],clearCart:()=>{cleared++;listeners['luddies:catalog-cart-changed']();}}}
    };
    vm.runInNewContext(fs.readFileSync('client/js/money.js','utf8'),context);
    vm.runInNewContext(fs.readFileSync('client/js/payment.js','utf8'),context);
    listeners.DOMContentLoaded();
    element('payment-simulation-form').submit({preventDefault(){}});
    element('payment-simulation-form').submit({preventDefault(){}});
    assert.equal(cleared,1);
    assert.equal(element('payment-success-view').hidden,false);
    assert.equal(element('payment-checkout-view').hidden,true);
    assert.equal(element('payment-error-banner').hidden,true);
    const receipt=JSON.parse(storage.get('luddies.payment_receipt'));
    assert.equal(receipt.demo,true);
    assert.equal(receipt.total,199);
    assert.deepEqual(Object.keys(receipt).sort(),['at','demo','reference','total']);
});
