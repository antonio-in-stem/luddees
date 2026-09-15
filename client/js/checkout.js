(function () {
    "use strict";

    var PROFILE_KEY = "luddies.checkout_profile";
    var PAYMENT_STUB_KEY = "luddies.payment_stub";
    var CART_ITEMS_PER_PAGE = 4;
    var currentCartPage = 1;

    function t(key) {
        return window.LuddiesI18n && window.LuddiesI18n.t ? window.LuddiesI18n.t(key) : key;
    }

    function readProfile() {
        try {
            var raw = sessionStorage.getItem(PROFILE_KEY);
            var d = raw ? JSON.parse(raw) : {};
            return d && typeof d === "object" ? d : {};
        } catch (e) {
            return {};
        }
    }

    function writeProfile(data) {
        try {
            sessionStorage.setItem(PROFILE_KEY, JSON.stringify(data));
        } catch (e) {
        }
    }

    function getCart() {
        return window.LuddiesCatalogCart && window.LuddiesCatalogCart.readCart
            ? window.LuddiesCatalogCart.readCart()
            : [];
    }

    function getProductById(id) {
        var products = window.LuddiesAuth && window.LuddiesAuth.getProducts
            ? window.LuddiesAuth.getProducts()
            : (window.LUDDIES_CATALOG_SEED || []);
        return products.find(function (product) {
            return String(product.id) === String(id);
        }) || null;
    }

    var parseMXNAmountFromPriceText = window.LuddiesMoney.parsePrice;

    var formatMXNTotal = window.LuddiesMoney.formatTotal;

    function renderCartTotal(wrapEl, valEl, items) {
        if (!wrapEl || !valEl) return;
        if (!items.length) {
            wrapEl.hidden = true;
            return;
        }
        var sum = 0;
        var ok = 0;
        items.forEach(function (item) {
            var txt = item.priceKey ? t(item.priceKey) : "";
            var n = parseMXNAmountFromPriceText(txt);
            if (!isNaN(n)) {
                sum += n;
                ok += 1;
            }
        });
        if (ok !== items.length || sum <= 0) {
            wrapEl.hidden = true;
            return;
        }
        wrapEl.hidden = false;
        valEl.textContent = formatMXNTotal(sum);
    }

    function cfgFor(mapKey) {
        var validation = window.LuddiesI18n && window.LuddiesI18n.getContactValidation
            ? window.LuddiesI18n.getContactValidation()
            : {};
        return (validation && validation[mapKey]) || {};
    }

    function getMessage(field, mapKey) {
        var cfg = cfgFor(mapKey);
        if (field.validity.valueMissing) {
            return cfg.valueMissing || "Required.";
        }
        if (field.validity.typeMismatch) {
            return cfg.typeMismatch || "Invalid format.";
        }
        if (field.validity.tooShort) {
            return cfg.tooShort || "Too short.";
        }
        if (field.validity.patternMismatch) {
            return cfg.patternMismatch || "Invalid format.";
        }
        return "";
    }

    function setFieldError(fieldId, textId, containerId, show, message) {
        var field = document.getElementById(fieldId);
        var text = document.getElementById(textId);
        var container = document.getElementById(containerId);
        if (!field) return;
        field.classList.toggle("is-invalid", show);
        field.classList.toggle("is-valid", !show && field.value.trim() !== "");
        if (container) {
            container.classList.toggle("visible", show);
        }
        if (text) {
            text.textContent = show ? message : "";
        }
    }

    function clearFieldError(fieldId, textId, containerId) {
        var field = document.getElementById(fieldId);
        if (field) {
            field.classList.remove("is-invalid", "is-valid");
        }
        setFieldError(fieldId, textId, containerId, false, "");
    }

    function validateCheckoutCorreo() {
        var field = document.getElementById("checkoutCorreo");
        if (!field) return false;
        var ok = field.checkValidity();
        if (!ok) {
            setFieldError(
                "checkoutCorreo",
                "errorCheckoutCorreoText",
                "errorCheckoutCorreo",
                true,
                getMessage(field, "inputCorreo")
            );
        } else {
            clearFieldError("checkoutCorreo", "errorCheckoutCorreoText", "errorCheckoutCorreo");
        }
        return ok;
    }

    function validateCheckoutNombre() {
        var field = document.getElementById("checkoutNombre");
        if (!field) return true;
        var v = field.value.trim();
        if (!v) {
            clearFieldError("checkoutNombre", "errorCheckoutNombreText", "errorCheckoutNombre");
            return true;
        }
        var ok = field.checkValidity();
        if (!ok) {
            setFieldError(
                "checkoutNombre",
                "errorCheckoutNombreText",
                "errorCheckoutNombre",
                true,
                getMessage(field, "inputNombre")
            );
        } else {
            clearFieldError("checkoutNombre", "errorCheckoutNombreText", "errorCheckoutNombre");
        }
        return ok;
    }

    function renderCartPagination(paginationEl, itemCount) {
        if (!paginationEl) return;
        var totalPages = Math.max(1, Math.ceil(itemCount / CART_ITEMS_PER_PAGE));
        currentCartPage = Math.min(Math.max(currentCartPage, 1), totalPages);
        paginationEl.innerHTML = "";
        paginationEl.hidden = totalPages <= 1;
        if (totalPages <= 1) return;

        function addButton(label, page, ariaLabel, current, disabled) {
            var button = document.createElement("button");
            button.type = "button";
            button.textContent = label;
            button.setAttribute("data-cart-page", String(page));
            button.setAttribute("aria-label", ariaLabel);
            if (current) button.setAttribute("aria-current", "page");
            button.disabled = !!disabled;
            paginationEl.appendChild(button);
        }

        addButton("‹", currentCartPage - 1, t("checkout_cart_previous_page"), false, currentCartPage === 1);
        for (var page = 1; page <= totalPages; page += 1) {
            addButton(String(page), page, t("checkout_cart_page_label").replace(/\{n\}/g, String(page)), page === currentCartPage, false);
        }
        addButton("›", currentCartPage + 1, t("checkout_cart_next_page"), false, currentCartPage === totalPages);
    }

    function renderCartLines(listEl, countEl, totalWrapEl, totalValEl, paginationEl) {
        if (!listEl) return;
        var items = getCart();
        listEl.innerHTML = "";

        if (countEl) {
            countEl.textContent = t("checkout_items_count").replace(/\{n\}/g, String(items.length));
        }

        var totalPages = Math.max(1, Math.ceil(items.length / CART_ITEMS_PER_PAGE));
        currentCartPage = Math.min(Math.max(currentCartPage, 1), totalPages);
        var pageStart = (currentCartPage - 1) * CART_ITEMS_PER_PAGE;
        items.slice(pageStart, pageStart + CART_ITEMS_PER_PAGE).forEach(function (item) {
            var title = item.titleKey ? t(item.titleKey) : "";
            var price = item.priceKey ? t(item.priceKey) : "";
            var product = getProductById(item.id);

            var li = document.createElement("li");
            li.className = "checkout-line";
            li.setAttribute("data-cart-id", item.id);

            if (product && product.img) {
                var thumb = document.createElement("div");
                thumb.className = "checkout-line__thumb";
                thumb.setAttribute("aria-hidden", "true");
                var img = document.createElement("img");
                img.src = product.img;
                img.alt = "";
                img.loading = "lazy";
                thumb.appendChild(img);
                li.appendChild(thumb);
            }

            var body = document.createElement("div");
            body.className = "checkout-line__body";
            var h = document.createElement("p");
            h.className = "checkout-line__title";
            h.textContent = title;
            var p = document.createElement("p");
            p.className = "checkout-line__price";
            p.textContent = price;
            body.appendChild(h);
            body.appendChild(p);

            var rm = document.createElement("button");
            rm.type = "button";
            rm.className = "checkout-line__remove js-checkout-remove";
            rm.setAttribute("data-remove-id", item.id);
            rm.textContent = t("checkout_remove");

            li.appendChild(body);
            li.appendChild(rm);
            listEl.appendChild(li);
        });

        renderCartPagination(paginationEl, items.length);
        renderCartTotal(totalWrapEl, totalValEl, items);
    }

    function syncVisibility(emptyEl, flowEl) {
        var items = getCart();
        var has = items.length > 0;
        if (emptyEl) {
            emptyEl.hidden = has;
        }
        if (flowEl) {
            flowEl.hidden = !has;
        }
    }

    function fillPaymentForm() {
        var d = readProfile();
        var email = document.getElementById("checkoutCorreo");
        var name = document.getElementById("checkoutNombre");
        if (email && d.email) email.value = d.email;
        if (name && d.name) name.value = d.name;
    }

    function readPaymentForm() {
        var email = document.getElementById("checkoutCorreo");
        var name = document.getElementById("checkoutNombre");
        return {
            email: email ? email.value.trim() : "",
            name: name ? name.value.trim() : "",
        };
    }

    function displayNameForContact(form) {
        if (form.name && form.name.length >= 2) {
            return form.name;
        }
        return t("checkout_anonymous_name");
    }

    function init() {
        if (window.LuddiesAuth && window.LuddiesAuth.syncProductLabelsToI18n) {
            window.LuddiesAuth.syncProductLabelsToI18n();
        }
        var emptyEl = document.getElementById("checkout-empty-state");
        var flowEl = document.getElementById("checkout-main-flow");
        var listEl = document.getElementById("checkout-cart-lines");
        var countEl = document.getElementById("checkout-cart-count");
        var totalRowEl = document.getElementById("checkout-cart-total-row");
        var totalValEl = document.getElementById("checkout-cart-total-value");
        var paginationEl = document.getElementById("checkout-cart-pagination");
        var form = document.getElementById("checkout-payment-form");
        var btnSubmit = document.getElementById("checkout-submit-purchase");
        var correo = document.getElementById("checkoutCorreo");
        var nombre = document.getElementById("checkoutNombre");
        var btnClear = document.getElementById("checkout-clear-cart");

        function refresh() {
            syncVisibility(emptyEl, flowEl);
            renderCartLines(listEl, countEl, totalRowEl, totalValEl, paginationEl);
        }

        refresh();
        fillPaymentForm();

        document.addEventListener("click", function (e) {
            var pageButton = e.target.closest("[data-cart-page]");
            if (pageButton && !pageButton.disabled) {
                currentCartPage = parseInt(pageButton.getAttribute("data-cart-page"), 10) || 1;
                refresh();
                if (listEl) listEl.focus({ preventScroll: true });
                return;
            }
            var rm = e.target.closest(".js-checkout-remove");
            if (!rm) return;
            var id = rm.getAttribute("data-remove-id");
            if (!id || !window.LuddiesCatalogCart || !window.LuddiesCatalogCart.removeProduct) return;
            window.LuddiesCatalogCart.removeProduct(id);
            refresh();
        });

        document.addEventListener("luddies:catalog-cart-changed", refresh);
        document.addEventListener("luddies:lang-changed", function () {
            refresh();
            validateCheckoutCorreo();
            validateCheckoutNombre();
        });

        var saveTimer;
        function scheduleSave() {
            clearTimeout(saveTimer);
            saveTimer = setTimeout(function () {
                var data = readPaymentForm();
                writeProfile({ email: data.email, name: data.name });
            }, 320);
        }

        if (correo) {
            correo.addEventListener("blur", validateCheckoutCorreo);
            correo.addEventListener("input", function () {
                if (correo.classList.contains("is-invalid")) {
                    validateCheckoutCorreo();
                }
                scheduleSave();
            });
        }
        if (nombre) {
            nombre.addEventListener("blur", validateCheckoutNombre);
            nombre.addEventListener("input", function () {
                if (nombre.classList.contains("is-invalid")) {
                    validateCheckoutNombre();
                }
                scheduleSave();
            });
        }

        if (btnSubmit && form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                var okEmail = validateCheckoutCorreo();
                var okName = validateCheckoutNombre();
                if (!okEmail || !okName) {
                    var first = form.querySelector(".is-invalid");
                    if (first) {
                        first.focus();
                    }
                    return;
                }

                var data = readPaymentForm();
                writeProfile({ email: data.email, name: data.name });

                try {
                    sessionStorage.setItem(
                        PAYMENT_STUB_KEY,
                        JSON.stringify({
                            email: data.email,
                            name: displayNameForContact(data),
                            at: Date.now(),
                        })
                    );
                } catch (err) {

                }

                window.location.href = "payment.html";
            });
        }

        if (btnClear) {
            btnClear.addEventListener("click", function () {
                if (!window.LuddiesCatalogCart || !window.LuddiesCatalogCart.clearCart) return;
                window.LuddiesCatalogCart.clearCart();
                refresh();
            });
        }
    }

    document.addEventListener("DOMContentLoaded", init);
})();
