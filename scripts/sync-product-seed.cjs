const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const insertPath = path.join(root, "server", "src_db", "main", "resources", "db", "insert.sql");
const context = {
    window: {},
    document: {
        addEventListener() {},
        querySelectorAll() { return []; },
        getElementById() { return null; },
        dispatchEvent() {}
    },
    sessionStorage: {
        getItem() { return null; },
        setItem() {}
    },
    CustomEvent: function CustomEvent() {}
};

vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "client", "js", "i18n.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "client", "js", "catalog-seed.js"), "utf8"), context);

const translations = context.window.LuddiesI18n.translations;
const products = context.window.LUDDIES_CATALOG_SEED;
const categoryIds = {
    science: 1,
    technology: 2,
    engineering: 3,
    mathematics: 4,
    neurodiversity: 5,
    certification: 6,
    physical: 7,
    dissidents: 8
};

function quote(value) {
    return `'${String(value).replace(/'/g, "''")}'`;
}

function amount(price) {
    const match = String(price).match(/\$\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)/);
    if (!match) throw new Error(`Invalid seed price: ${price}`);
    return Number(match[1].replace(/,/g, "")).toFixed(2);
}

function productRow(product) {
    const es = translations.es;
    const en = translations.en;
    return `  (${product.id}, ${quote(es[product.name])}, ${quote(en[product.name])}, ${quote(es[product.meta])}, ${quote(en[product.meta])}, ${quote(es[product.description])}, ${quote(en[product.description])}, ${amount(es[product.price])}, 'MXN', ${quote(es[product.price])}, ${quote(en[product.price])}, ${quote(product.img)}, 1, 0, 1, '2025-01-15 12:00:00')`;
}

function categoryRows(product) {
    return String(product.category)
        .split(/\s+/)
        .filter(Boolean)
        .map((slug) => {
            const categoryId = categoryIds[slug];
            if (!categoryId) throw new Error(`Unknown category slug: ${slug}`);
            return `  (${product.id}, ${categoryId})`;
        });
}

const productInsert = `INSERT INTO products (
  id, title_es, title_en, meta_es, meta_en,
  description_es, description_en,
  price_amount, currency, price_display_es, price_display_en,
  image_url, purchasable, is_custom, is_active, created_at
) VALUES
${products.map(productRow).join(",\n")};`;

const categoryInsert = `INSERT INTO product_categories (product_id, category_id) VALUES
${products.flatMap(categoryRows).join(",\n")};`;

const original = fs.readFileSync(insertPath, "utf8");
const synchronized = original
    .replace(/INSERT INTO products \([\s\S]*?;\r?\n\r?\n(?=INSERT INTO product_categories)/, `${productInsert}\n\n`)
    .replace(/INSERT INTO product_categories[\s\S]*?;\r?\n\r?\n(?=INSERT INTO carts)/, `${categoryInsert}\n\n`);

if (synchronized === original && !process.argv.includes("--check")) {
    console.log(`Product seed already contains ${products.length} synchronized products.`);
} else if (process.argv.includes("--check")) {
    if (synchronized !== original) {
        console.error("MySQL products differ from the browser catalog seed.");
        process.exitCode = 1;
    } else {
        console.log(`Verified ${products.length} synchronized products in MySQL and the browser catalog.`);
    }
} else {
    fs.writeFileSync(insertPath, synchronized);
    console.log(`Synchronized ${products.length} products into MySQL seed data.`);
}
