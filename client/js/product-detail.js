(function () {
    "use strict";

    var currentProduct = null;

    function keySet(product) {
        if (!product.custom) {
            return { name: product.name, description: product.description, meta: product.meta, price: product.price };
        }
        var id = String(product.id);
        return {
            name: "cat_dyn_" + id + "_name",
            description: "cat_dyn_" + id + "_desc",
            meta: "cat_dyn_" + id + "_meta",
            price: "cat_dyn_" + id + "_price"
        };
    }

    function translate(key) {
        return window.LuddiesI18n && window.LuddiesI18n.t ? window.LuddiesI18n.t(key) : key;
    }

    function findProduct() {
        var id = new URLSearchParams(window.location.search).get("id");
        var products = window.LuddiesAuth && window.LuddiesAuth.getProducts ? window.LuddiesAuth.getProducts() : [];
        return products.find(function (product) {
            return product && product.apiIsActive !== false && String(product.id) === String(id);
        }) || null;
    }

    function renderCategories(product) {
        var holder = document.getElementById("product-categories");
        if (!holder) return;
        var labels = {
            science: "cat_filter_science", technology: "cat_filter_technology",
            engineering: "cat_filter_engineering", mathematics: "cat_filter_mathematics",
            neurodiversity: "cat_filter_neurodiversity", certification: "cat_filter_certification",
            physical: "cat_filter_physical", dissidents: "cat_filter_dissidents"
        };
        holder.innerHTML = "";
        String(product.category || "").split(/\s+/).filter(Boolean).forEach(function (category) {
            var chip = document.createElement("span");
            chip.textContent = translate(labels[category] || category);
            holder.appendChild(chip);
        });
    }

    function renderProduct() {
        currentProduct = findProduct();
        var stage = document.getElementById("product-stage");
        var details = document.getElementById("product-details");
        var missing = document.getElementById("product-not-found");
        if (!currentProduct) {
            stage.hidden = true;
            details.hidden = true;
            missing.hidden = false;
            return;
        }

        var keys = keySet(currentProduct);
        var title = translate(keys.name);
        var productImage = currentProduct.img || "";
        document.getElementById("product-image").src = productImage;
        document.getElementById("product-image-backdrop").src = productImage;
        document.getElementById("product-meta").textContent = translate(keys.meta);
        document.getElementById("product-title").textContent = title;
        document.getElementById("product-description").textContent = translate(keys.description);
        document.getElementById("product-price").textContent = translate(keys.price);
        renderCategories(currentProduct);
        document.title = title + " | Luddies";

        var button = document.getElementById("product-acquire");
        var purchasable = currentProduct.purchasable !== false && currentProduct.purchasable !== 0 && currentProduct.purchasable !== "0";
        document.getElementById("product-availability").setAttribute("data-i18n", purchasable ? "cat_prod_badge_available" : "cat_prod_badge_soon");
        var guest = purchasable && window.LuddiesAuth && !window.LuddiesAuth.getSession();
        button.setAttribute("data-product-id", currentProduct.id);
        button.setAttribute("data-product-title-key", keys.name);
        button.setAttribute("data-product-price-key", keys.price);
        button.setAttribute("data-catalog-purchasable", purchasable ? "1" : "0");
        button.setAttribute("data-i18n", purchasable ? (guest ? "cat_acquire_login" : "cat_acquire_btn") : "cat_acquire_soon");
        button.disabled = !purchasable;
        stage.hidden = false;
        details.hidden = false;
        missing.hidden = true;
        if (window.LuddiesI18n) window.LuddiesI18n.applyTranslations(window.LuddiesI18n.getLang());
    }

    function boot() {
        if (window.LuddiesAuth && window.LuddiesAuth.syncProductLabelsToI18n) {
            window.LuddiesAuth.syncProductLabelsToI18n();
        }
        renderProduct();
        if (window.LuddiesAuth && window.LuddiesAuth.usesApi && window.LuddiesAuth.usesApi() && window.LuddiesAuth.loadProducts) {
            window.LuddiesAuth.loadProducts().then(renderProduct).catch(function () {});
        }
    }

    document.addEventListener("DOMContentLoaded", boot);
    document.addEventListener("luddies:lang-changed", renderProduct);
})();
