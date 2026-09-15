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
