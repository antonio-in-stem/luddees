

(function () {
    "use strict";

    function registerAllProductI18n() {
        if (window.LuddiesAuth && window.LuddiesAuth.syncProductLabelsToI18n) {
            window.LuddiesAuth.syncProductLabelsToI18n();
        }
    }

    function buildCatalogCard(product) {
        var tpl = document.getElementById("catalog-card-tpl");
        if (!tpl) return null;

        var clone = tpl.content.cloneNode(true);
        var wrapper = clone.querySelector(".catalog-grid-item");
        if (!wrapper) return null;

        wrapper.setAttribute("data-catalog-cats", product.category || "");

        var img = clone.querySelector(".catalog-card-img");
        img.src = product.img || "";
        img.alt = "";

        var nameKey = product.name;
        var descKey = product.description;
        var metaKey = product.meta;
        var priceKey = product.price;
        if (product.custom) {
            var sid = String(product.id);
            nameKey = "cat_dyn_" + sid + "_name";
            descKey = "cat_dyn_" + sid + "_desc";
            metaKey = "cat_dyn_" + sid + "_meta";
            priceKey = "cat_dyn_" + sid + "_price";
        }

        clone.querySelector(".catalog-card-meta").setAttribute("data-i18n", metaKey);
        var titleId = "catalog-product-title-" + String(product.id).replace(/[^a-zA-Z0-9_-]/g, "-");
        var title = clone.querySelector(".catalog-card-title");
        var titleLink = clone.querySelector(".catalog-card-title-link");
        title.id = titleId;
        titleLink.setAttribute("data-i18n", nameKey);
        clone.querySelector(".catalog-card-desc").setAttribute("data-i18n", descKey);
        clone.querySelector(".catalog-card-price").setAttribute("data-i18n", priceKey);

        var purchasable = product.purchasable !== false && product.purchasable !== 0 && product.purchasable !== "0";
        var guest = purchasable && window.LuddiesAuth && !window.LuddiesAuth.getSession();
        var btn = clone.querySelector(".js-catalog-acquire");
        btn.setAttribute("data-product-id", product.id);
        btn.setAttribute("data-product-title-key", nameKey);
        btn.setAttribute("data-product-price-key", priceKey);
        btn.setAttribute("data-catalog-purchasable", purchasable ? "1" : "0");
        if (purchasable) {
            if (guest) {
                btn.setAttribute("data-i18n", "cat_acquire_login");
                btn.classList.remove("btn-luddies--primary");
                btn.classList.add("btn-luddies--outline", "catalog-acquire--guest");
            } else {
                btn.setAttribute("data-i18n", "cat_acquire_btn");
                btn.classList.remove("catalog-acquire--guest");
            }
            btn.classList.remove("disabled");
        } else {
            btn.setAttribute("data-i18n", "cat_acquire_soon");
            btn.setAttribute("disabled", "disabled");
            btn.classList.add("disabled");
        }

        var detailUrl = "product.html?id=" + encodeURIComponent(product.id);
        clone.querySelectorAll(".js-product-detail-link").forEach(function (link) {
            link.href = detailUrl;
        });
        clone.querySelector(".catalog-card-media").setAttribute("aria-labelledby", titleId);
        clone.querySelector(".catalog-card-actions .js-product-detail-link").setAttribute("data-i18n", "cat_prod_more_info");
        clone.querySelector(".catalog-badge").setAttribute("data-i18n", "cat_prod_badge_consult");

        return clone;
    }

    function renderCatalog() {
        var container = document.getElementById("catalog-products-container");
        if (!container) {
            return;
        }
        if (!window.LuddiesAuth || !window.LuddiesAuth.getProducts) {
            document.dispatchEvent(new CustomEvent("luddies:catalog-items-mounted", { bubbles: true }));
            return;
        }

        registerAllProductI18n();
        container.innerHTML = "";
        var products = window.LuddiesAuth.getProducts().filter(function (p) {
            return p && p.apiIsActive !== false;
        });
        var fragment = document.createDocumentFragment();
        products.forEach(function (product) {
            var card = buildCatalogCard(product);
            if (card) {
                fragment.appendChild(card);
            }
        });
        container.appendChild(fragment);

        if (window.LuddiesI18n && window.LuddiesI18n.applyTranslations) {
            window.LuddiesI18n.applyTranslations(window.LuddiesI18n.getLang());
        }
        document.dispatchEvent(new CustomEvent("luddies:catalog-items-mounted", { bubbles: true }));
    }

    function bootCatalog() {
        if (window.LuddiesAuth && window.LuddiesAuth.usesApi && window.LuddiesAuth.usesApi() && window.LuddiesAuth.loadProducts) {
            renderCatalog();
            window.LuddiesAuth.loadProducts().then(renderCatalog).catch(renderCatalog);
        } else {
            renderCatalog();
        }
    }

    document.addEventListener("DOMContentLoaded", bootCatalog);
    document.addEventListener("luddies:lang-changed", function () {
        registerAllProductI18n();
        if (window.LuddiesI18n) window.LuddiesI18n.applyTranslations(window.LuddiesI18n.getLang());
    });

    window.LuddiesCatalog = {
        registerAllProductI18n: registerAllProductI18n,
        renderCatalog: renderCatalog
    };
})();
