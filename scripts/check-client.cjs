const fs = require('node:fs');
const path = require('node:path');
const acorn = require('acorn');
const postcss = require('postcss');
const parse5 = require('parse5');

function filesIn(directory) {
    return fs.readdirSync(directory, {withFileTypes:true}).flatMap(entry => {
        const file = path.join(directory, entry.name);
        return entry.isDirectory() ? filesIn(file) : [file];
    });
}

const errors = [];
const pages = [];
function checkLink(file, value) {
    if (!value || /^(?:https?:|data:|mailto:|tel:|#)/i.test(value)) return;
    const pathname = value.split(/[?#]/)[0];
    if (!pathname) return;
    const base = file.includes('partials') ? path.resolve('client/html') : path.dirname(file);
    const resolved = pathname.startsWith('/') ? path.join('client', pathname) : path.resolve(base, pathname);
    if (!fs.existsSync(resolved)) errors.push(`${file}: missing asset ${value}`);
}

for (const file of filesIn('client')) {
    if (!/\.(js|css|html)$/.test(file)) continue;
    const text = fs.readFileSync(file,'utf8');
    if (/C:[\\/]Users[\\/]|\/Users\/|\/home\/[a-z]+\//.test(text)) errors.push(`${file}: local workstation path`);
    try {
        if (file.endsWith('.js')) {
            const comments = [];
            acorn.parse(text,{ecmaVersion:'latest',onComment:comments});
            if(comments.length) errors.push(`${file}: source comments remain`);
        }
        if (file.endsWith('.css')) {
            const root = postcss.parse(text);
            root.walkComments(()=>errors.push(`${file}: source comments remain`));
            root.walkDecls(decl => {
                for(const match of decl.value.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) checkLink(file, match[1]);
            });
        }
        if (file.endsWith('.html')) {
            const document = parse5.parse(text);
            const ids = new Set();
            const visit = node => {
                if (node.nodeName === '#comment') errors.push(`${file}: source comments remain`);
                const attrs = Object.fromEntries((node.attrs||[]).map(a=>[a.name,a.value]));
                if (attrs.id) {
                    if(ids.has(attrs.id)) errors.push(`${file}: duplicate id ${attrs.id}`);
                    ids.add(attrs.id);
                }
                for(const key of ['src','href']) if(attrs[key]) checkLink(file,attrs[key]);
                if(attrs.srcset) for(const src of attrs.srcset.split(',')) checkLink(file,src.trim().split(/\s/)[0]);
                if(node.nodeName==='img' && !('alt' in attrs)) errors.push(`${file}: image without alt`);
                if(node.nodeName==='script' && !attrs.src) acorn.parse((node.childNodes||[]).map(n=>n.value||'').join(''),{ecmaVersion:'latest'});
                for(const child of node.childNodes||[]) visit(child);
            };
            visit(document);
            if(!file.includes('partials')) pages.push(file);
        }
    } catch(error) { errors.push(`${file}: ${error.message}`); }
}
if(errors.length) { console.error(errors.join('\n')); process.exitCode=1; }
else console.log(`Validated scripts, styles, images and local links across ${pages.length} HTML entry points.`);
