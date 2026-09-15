

(function () {
    "use strict";

    var STORAGE_KEY = "luddies.catalog_cart";
    var NON_PURCHASABLE_IDS = {};

    function readCart() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            var data = raw ? JSON.parse(raw) : [];
            var arr = Array.isArray(data) ? data : [];
            var filtered = arr.filter(function (p) {
                return !NON_PURCHASABLE_IDS[String(p.id)];
            });
            if (filtered.length !== arr.length) {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
                } catch (e2) {

                }
            }
            return filtered;
        } catch (e) {
            return [];
        }
    }

    function writeCart(items) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) {

        }
    }

    function getDict() {
        var lang = window.LuddiesI18n && window.LuddiesI18n.getLang ? window.LuddiesI18n.getLang() : "es";
        var t = window.LuddiesI18n && window.LuddiesI18n.translations;
        return (t && t[lang]) || {};
    }

    function barTemplate(count) {
        var dict = getDict();
        var tpl = dict.cat_cart_bar || "Selection: {n}";
        return tpl.replace(/\{n\}/g, String(count));
    }

    function renderBar() {
        var bar = document.getElementById("catalog-cart-bar");
        var textEl = document.getElementById("catalog-cart-bar-text");
        if (!bar || !textEl) return;

        var items = readCart();
        if (items.length === 0) {
            bar.hidden = true;
            document.body.classList.remove("has-catalog-cart");
            return;
        }
        bar.hidden = false;
        document.body.classList.add("has-catalog-cart");
        textEl.textContent = barTemplate(items.length);
    }

    function addProduct(id, titleKey, priceKey) {
        if (NON_PURCHASABLE_IDS[String(id)]) return;
        var items = readCart();
        var exists = items.some(function (p) {
            return String(p.id) === String(id);
        });
        if (!exists) {
            items.push({
                id: String(id),
                titleKey: titleKey,
                priceKey: priceKey || "",
            });
            writeCart(items);
        }
        renderBar();
        var productTitle =
            window.LuddiesI18n && window.LuddiesI18n.t ? window.LuddiesI18n.t(titleKey) : "";
        showCartToast(exists, productTitle);
        announceCartChange(exists, productTitle);
        document.dispatchEvent(new CustomEvent("luddies:catalog-cart-changed", { detail: { count: items.length } }));
    }

    function removeProduct(id) {
        var sid = String(id);
        var items = readCart().filter(function (p) {
            return String(p.id) !== sid;
        });
        writeCart(items);
        renderBar();
        document.dispatchEvent(new CustomEvent("luddies:catalog-cart-changed", { detail: { count: items.length } }));
    }

    function clearCart() {
        writeCart([]);
        renderBar();
        document.dispatchEvent(new CustomEvent("luddies:catalog-cart-changed", { detail: { count: 0 } }));
    }

    var toastHideTimer;

    function hideCartToast() {
        var toast = document.getElementById("catalog-cart-toast");
        if (!toast) return;
        toast.classList.remove("is-visible");
        toast.classList.remove("catalog-cart-toast--duplicate");
        setTimeout(function () {
            if (!toast.classList.contains("is-visible")) {
                toast.hidden = true;
            }
        }, 420);
    }

    function showCartToast(alreadyHad, productTitle) {
        var toast = document.getElementById("catalog-cart-toast");
        var msgEl = document.getElementById("catalog-cart-toast-msg");
        if (!toast || !msgEl) return;

        clearTimeout(toastHideTimer);

        var dict = getDict();
        var text;
        var iconEl = toast.querySelector(".catalog-cart-toast__icon");
        if (alreadyHad) {
            text = dict.cat_cart_toast_duplicate || "Already in your selection.";
            toast.classList.add("catalog-cart-toast--duplicate");
            if (iconEl) {
                iconEl.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
            }
        } else {
            var tpl = dict.cat_cart_toast_added || "Added: {title}";
            text = tpl.replace(/\{title\}/g, productTitle || "");
            toast.classList.remove("catalog-cart-toast--duplicate");
            if (iconEl) {
                iconEl.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
            }
        }
        msgEl.textContent = text;

        toast.hidden = false;
        requestAnimationFrame(function () {
            toast.classList.add("is-visible");
        });

        toastHideTimer = setTimeout(hideCartToast, 4800);
    }

    function announceCartChange(alreadyHad, productTitle) {
        var el = document.getElementById("catalog-cart-live");
        if (!el) return;
        var dict = getDict();
        var msg;
        if (alreadyHad) {
            msg = dict.cat_cart_toast_duplicate || "";
        } else {
            var tpl = dict.cat_cart_toast_added || dict.cat_cart_added || "Added";
            msg = tpl.replace(/\{title\}/g, productTitle || "");
        }
        el.textContent = msg;
        setTimeout(function () {
            el.textContent = "";
        }, 2800);
    }

    function onAcquireClick(e) {
        var btn = e.target.closest(".js-catalog-acquire");
        if (!btn) return;
        if (btn.disabled || btn.getAttribute("aria-disabled") === "true") return;
        if (btn.getAttribute("data-catalog-purchasable") === "0") return;
        if (!window.LuddiesAuth || !window.LuddiesAuth.getSession()) {
            e.preventDefault();
            window.location.href = "login.html?return=" + encodeURIComponent(window.location.href);
            return;
        }
        e.preventDefault();
        var id = btn.getAttribute("data-product-id");
        var titleKey = btn.getAttribute("data-product-title-key");
        var priceKey = btn.getAttribute("data-product-price-key") || "";
        if (!id || !titleKey) return;
        addProduct(id, titleKey, priceKey);
    }

    window.LuddiesCatalogCart = {
        readCart: readCart,
        writeCart: writeCart,
        removeProduct: removeProduct,
        clearCart: clearCart,
        renderBar: renderBar,
    };

    document.addEventListener("DOMContentLoaded", function () {
        renderBar();

        document.addEventListener("click", onAcquireClick);

        var clearBtn = document.getElementById("catalog-cart-clear");
        if (clearBtn) {
            clearBtn.addEventListener("click", function (e) {
                e.preventDefault();
                clearCart();
            });
        }

        document.addEventListener("luddies:lang-changed", function () {
            renderBar();
        });

        var toastClose = document.getElementById("catalog-cart-toast-close");
        if (toastClose) {
            toastClose.addEventListener("click", function () {
                clearTimeout(toastHideTimer);
                hideCartToast();
            });
        }
    });
})();
