(function () {
    "use strict";

    var STUB_KEY    = "luddies.payment_stub";
    var CART_KEY    = "luddies.catalog_cart";
    var RECEIPT_KEY = "luddies.payment_receipt";

    function t(key) {
        return window.LuddiesI18n && window.LuddiesI18n.t ? window.LuddiesI18n.t(key) : key;
    }

    function readCart() {
        try {
            if (window.LuddiesCatalogCart && window.LuddiesCatalogCart.readCart) {
                return window.LuddiesCatalogCart.readCart();
            }
            var raw = localStorage.getItem(CART_KEY);
            var data = raw ? JSON.parse(raw) : [];
            return Array.isArray(data) ? data : [];
        } catch (e) {
            return [];
        }
    }

    var parseMXNAmountFromPriceText = window.LuddiesMoney.parsePrice;

    var formatMXNTotal = window.LuddiesMoney.formatTotal;

    function computeCartSummary(items) {
        var total = 0;
        var validItems = 0;
        items.forEach(function (item) {
            var txt = item && item.priceKey ? t(item.priceKey) : "";
            var n = parseMXNAmountFromPriceText(txt);
            if (!isNaN(n)) {
                total += n;
                validItems += 1;
            }
        });
        return {
            itemCount: items.length,
            validItems: validItems,
            total: total,
            isValid: items.length > 0 && validItems === items.length && total > 0,
        };
    }

    function makeReference() {
        var stamp = Date.now().toString(36).toUpperCase();
        var rand  = Math.random().toString(36).substring(2, 8).toUpperCase();
        return "LUD-" + stamp + "-" + rand;
    }

    function showBanner(el, message) {
        if (!el) return;
        el.textContent = message;
        el.hidden = false;
    }

    function hideBanner(el) {
        if (!el) return;
        el.hidden = true;
        el.textContent = "";
    }

    function validateCheckoutReadiness(summary, email) {
        if (!summary.itemCount)  return t("payment_error_empty_cart");
        if (!summary.isValid)    return t("payment_error_invalid_total");
        if (!email)              return t("payment_error_missing_email");
        return "";
    }

    function setSubmitState(button, disabled, loading) {
        if (!button) return;
        button.disabled = !!disabled;
        button.classList.toggle("loading", !!loading);
        button.setAttribute("aria-busy", loading ? "true" : "false");
    }

    function clearCart() {
        if (window.LuddiesCatalogCart && window.LuddiesCatalogCart.clearCart) {
            window.LuddiesCatalogCart.clearCart();
            return;
        }
        try {
            localStorage.setItem(CART_KEY, JSON.stringify([]));
        } catch (e) {              }
    }

    function countLabel(itemCount) {
        var template = t("payment_items_count");
        if (!template || template === "payment_items_count") return itemCount + " items";
        if (template.indexOf("{n}") >= 0) return template.replace(/\{n\}/g, String(itemCount));
        return itemCount + " " + template;
    }

    function isValidLuhn(val) {
        var sum = 0;
        var shouldDouble = false;
        for (var i = val.length - 1; i >= 0; i--) {
            var digit = parseInt(val.charAt(i), 10);
            if (shouldDouble) { if ((digit *= 2) > 9) digit -= 9; }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return (sum % 10) === 0;
    }

    function isValidExpiry(val) {
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(val)) return false;
        var parts = val.split("/");
        if (parts.length !== 2) return false;
        var month = parseInt(parts[0], 10);
        var year  = parseInt(parts[1], 10);
        if (month < 1 || month > 12) return false;
        var now          = new Date();
        var currentYear  = parseInt(now.getFullYear().toString().substring(2, 4), 10);
        var currentMonth = now.getMonth() + 1;
        if (year < currentYear) return false;
        if (year === currentYear && month < currentMonth) return false;
        return true;
    }
    document.addEventListener("DOMContentLoaded", function () {

        var elEmail     = document.getElementById("payment-stub-email");
        var elTotal     = document.getElementById("payment-total");
        var form        = document.getElementById("payment-simulation-form");
        var viewCheckout = document.getElementById("payment-checkout-view");
        var viewSuccess  = document.getElementById("payment-success-view");
        var btnPay       = document.getElementById("btn-simulate-pay");
        var errorBanner  = document.getElementById("payment-error-banner");
        var cartCountEl  = document.getElementById("payment-cart-count");
        var referenceEl  = document.getElementById("payment-confirmation-ref");
        var previewNumber = document.getElementById("payment-card-preview-number");
        var previewName   = document.getElementById("payment-card-preview-name");
        var previewExp    = document.getElementById("payment-card-preview-exp");

        var ccInput  = document.getElementById("cc-number");
        var expInput = document.getElementById("cc-exp");
        var cvcInput = document.getElementById("cc-cvc");

        var checkoutData   = null;
        var cartSummary    = null;
        var paymentReference = "";

        function renderEmail() {
            if (!elEmail) return;
            elEmail.textContent = (checkoutData && checkoutData.email)
                ? checkoutData.email
                : t("payment_email_missing");
        }

        function renderCardPreview() {
            if (previewName) {
                previewName.textContent = checkoutData && checkoutData.name
                    ? checkoutData.name.toUpperCase()
                    : "LUDDIES STEM";
            }
            if (previewNumber) {
                var digits = ccInput && ccInput.value ? ccInput.value.replace(/\D/g, "") : "";
                var padded = (digits + "••••••••••••••••").substring(0, 16);
                previewNumber.textContent = padded.replace(/(.{4})/g, "$1 ").trim();
            }
            if (previewExp) previewExp.textContent = expInput && expInput.value ? expInput.value : "MM/YY";
        }

        function readStoredReference() {
            try {
                var rawReceipt = sessionStorage.getItem(RECEIPT_KEY);
                if (!rawReceipt) return "";
                var receipt = JSON.parse(rawReceipt);
                return receipt && receipt.reference ? String(receipt.reference) : "";
            } catch (e) {
                return "";
            }
        }

        function renderReference() {
            if (!referenceEl || viewSuccess.hidden) return;
            if (!paymentReference) paymentReference = readStoredReference();
            referenceEl.textContent = paymentReference
                ? t("payment_reference_prefix") + " " + paymentReference
                : t("payment_reference_prefix") + " --";
        }

        function renderTotal() {
            var items = readCart();
            cartSummary = computeCartSummary(items);
            if (elTotal && cartSummary) {
                elTotal.textContent = cartSummary.isValid ? formatMXNTotal(cartSummary.total) : "$0 MXN";
            }
            if (cartCountEl && cartSummary) {
                cartCountEl.textContent = countLabel(cartSummary.itemCount);
            }
        }

        try {
            var rawStub = sessionStorage.getItem(STUB_KEY);
            if (rawStub) {
                var d = JSON.parse(rawStub);
                if (d && d.email) checkoutData = d;
            }
        } catch (e) {  }

        if (ccInput && expInput && cvcInput) {
            ccInput.value = "4242 4242 4242 4242";
            expInput.value = "12/" + String(new Date().getFullYear() + 2).slice(-2);
            cvcInput.value = "123";
            [ccInput, expInput, cvcInput].forEach(function (input) { input.readOnly = true; });
        }
        renderEmail();
        renderCardPreview();

        renderTotal();

        var readinessError = validateCheckoutReadiness(
            cartSummary || { itemCount: 0, isValid: false },
            checkoutData && checkoutData.email
        );
        if (readinessError) {
            showBanner(errorBanner, readinessError);
            setSubmitState(btnPay, true, false);
        } else {
            hideBanner(errorBanner);
            setSubmitState(btnPay, false, false);
        }

        document.addEventListener("luddies:catalog-cart-changed", function () {
            if (viewSuccess && !viewSuccess.hidden) return;
            renderTotal();
            var msg = validateCheckoutReadiness(
                cartSummary || { itemCount: 0, isValid: false },
                checkoutData && checkoutData.email
            );
            if (msg) {
                showBanner(errorBanner, msg);
                setSubmitState(btnPay, true, false);
            } else {
                hideBanner(errorBanner);
                setSubmitState(btnPay, false, false);
            }
        });

        if (ccInput && expInput && cvcInput) {
            ccInput.addEventListener("input", function (e) {
                var value = e.target.value.replace(/\D/g, "");
                var formatted = "";
                for (var i = 0; i < value.length; i++) {
                    if (i > 0 && i % 4 === 0) formatted += " ";
                    formatted += value[i];
                }
                e.target.value = formatted;
                ccInput.setCustomValidity("");
                renderCardPreview();
            });

            expInput.addEventListener("input", function (e) {
                var value = e.target.value.replace(/\D/g, "");
                e.target.value = value.length > 2
                    ? value.substring(0, 2) + "/" + value.substring(2, 4)
                    : value;
                expInput.setCustomValidity("");
                renderCardPreview();
            });

            cvcInput.addEventListener("input", function (e) {
                e.target.value = e.target.value.replace(/\D/g, "").substring(0, 4);
                cvcInput.setCustomValidity("");
            });
        }

        document.addEventListener("luddies:lang-changed", function () {
            renderEmail();
            renderTotal();
            renderCardPreview();
            renderReference();
        });

        function completeDemo(reference) {
            setSubmitState(btnPay, true, false);
            if (viewCheckout) viewCheckout.hidden = true;
            if (viewSuccess) viewSuccess.hidden = false;
            paymentReference = reference;
            try {
                sessionStorage.setItem(RECEIPT_KEY, JSON.stringify({
                    reference: reference,
                    total: cartSummary ? cartSummary.total : 0,
                    demo: true,
                    at: Date.now()
                }));
            } catch (e) {}
            renderReference();
            clearCart();
        }

        if (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                if (btnPay.disabled) return;
                hideBanner(errorBanner);

                renderTotal();
                var guardedError = validateCheckoutReadiness(
                    cartSummary || { itemCount: 0, isValid: false },
                    checkoutData && checkoutData.email
                );
                if (guardedError) {
                    showBanner(errorBanner, guardedError);
                    return;
                }

                if (ccInput && expInput && cvcInput) {
                    var ccVal = ccInput.value.replace(/\s/g, "");
                    if (!/^\d{13,19}$/.test(ccVal) || /^0+$/.test(ccVal) || !isValidLuhn(ccVal)) {
                        ccInput.setCustomValidity(t("payment_error_card_invalid"));
                        ccInput.reportValidity();
                        return;
                    }
                    if (!isValidExpiry(expInput.value)) {
                        expInput.setCustomValidity(t("payment_error_exp_invalid"));
                        expInput.reportValidity();
                        return;
                    }
                    if (cvcInput.value.length < 3) {
                        cvcInput.setCustomValidity(t("payment_error_cvc_invalid"));
                        cvcInput.reportValidity();
                        return;
                    }
                }

                setSubmitState(btnPay, true, true);

                completeDemo(makeReference());
            });
        }
    });
})();
