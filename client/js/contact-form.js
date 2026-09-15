(function () {
    "use strict";

    var _cfg               = (window.LuddiesConfig && window.LuddiesConfig.emailjs) || {};
    var EMAILJS_PUBLIC_KEY = _cfg.publicKeyContact  || "";
    var EMAILJS_SERVICE_ID = _cfg.serviceIdContact  || "";
    var EMAILJS_TEMPLATE_ID= _cfg.templateIdContact || "";

    document.addEventListener("DOMContentLoaded", function () {
        var form = document.getElementById("contactUsForm");
        if (!form) return;

        if (window.emailjs && typeof window.emailjs.init === "function") {
            try {
                window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
            } catch (e) {
                try { window.emailjs.init(EMAILJS_PUBLIC_KEY); } catch (_) {}
            }
        }

        (function consumeCheckoutPrefill() {
            try {
                var raw = sessionStorage.getItem("luddies.contact_prefill");
                if (!raw) return;
                var d = JSON.parse(raw);
                sessionStorage.removeItem("luddies.contact_prefill");
                var n = document.getElementById("inputNombre");
                var c = document.getElementById("inputCorreo");
                var a = document.getElementById("inputAsunto");
                var m = document.getElementById("inputMensaje");
                if (d.nombre && n) n.value = d.nombre;
                if (d.correo && c) c.value = d.correo;
                if (d.asunto && a) a.value = d.asunto;
                if (d.mensaje && m) {
                    m.value = d.mensaje;
                    m.dispatchEvent(new Event("input", { bubbles: true }));
                }
            } catch (e) {              }
        })();

        var btnSubmit    = document.getElementById("btnSubmit");
        var successBanner= document.getElementById("successBanner");
        var btnNew       = document.getElementById("btnNewMessage");
        var inputMensaje = document.getElementById("inputMensaje");
        var charCounter  = document.getElementById("charCounterMensaje");
        var fields       = Array.from(form.querySelectorAll("input, select, textarea"));

        if (!btnSubmit || !successBanner || !btnNew || !inputMensaje || !charCounter) return;

        var isSubmitting = false;

        function messagesForField(fieldId) {
            var validation = window.LuddiesI18n
                ? window.LuddiesI18n.getContactValidation()
                : {};
            return validation[fieldId] || {};
        }

        function getErrorNodes(field) {
            var container = document.getElementById(
                "error" + field.id.replace("input", "")
            );
            var text = container
                ? document.getElementById(container.id + "Text")
                : null;
            return { container: container, text: text };
        }

        function getMessage(field) {
            var cfg = messagesForField(field.id);
            if (field.validity.valueMissing)   return cfg.valueMissing   || "This field is required.";
            if (field.validity.typeMismatch)   return cfg.typeMismatch   || "Invalid format.";
            if (field.validity.tooShort)       return cfg.tooShort       || "Value is too short.";
            if (field.validity.patternMismatch)return cfg.patternMismatch|| "Invalid format.";
            return "";
        }

        function updateField(field) {
            var nodes   = getErrorNodes(field);
            var isValid = field.checkValidity();
            field.classList.toggle("is-invalid", !isValid);
            field.classList.toggle("is-valid",    isValid && field.value.trim() !== "");
            if (nodes.container) nodes.container.classList.toggle("visible", !isValid);
            if (nodes.text && !isValid) nodes.text.textContent = getMessage(field);
            return isValid;
        }

        function showSubmitError(msg) {
            var el = document.getElementById("submit-error-msg");
            if (el) { el.textContent = msg; el.classList.add("visible"); }
        }

        function hideSubmitError() {
            var el = document.getElementById("submit-error-msg");
            if (el) { el.textContent = ""; el.classList.remove("visible"); }
        }

        function getSubmitErrorMessage() {
            var lang = window.LuddiesI18n ? window.LuddiesI18n.getLang() : "es";
            return lang === "en"
                ? "We couldn't send your message. Please try again in a moment."
                : "No pudimos enviar tu mensaje. Inténtalo de nuevo en un momento.";
        }

        inputMensaje.addEventListener("input", function () {
            var len = inputMensaje.value.length;
            charCounter.textContent = len + " / 500";
            charCounter.classList.toggle("near-limit", len >= 450);
            if (inputMensaje.classList.contains("is-invalid")) updateField(inputMensaje);
        });

        fields.forEach(function (field) {
            field.addEventListener("blur",  function () { updateField(field); });
            field.addEventListener("input", function () {
                if (field.classList.contains("is-invalid")) updateField(field);
            });
        });

        document.addEventListener("luddies:lang-changed", function () {
            fields.filter(function (field) { return field.classList.contains("is-invalid"); }).forEach(updateField);
            hideSubmitError();
        });

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (isSubmitting) return;

            hideSubmitError();

            var allValid = fields.map(updateField).every(Boolean);
            if (!allValid) {
                var firstInvalid = form.querySelector(".is-invalid");
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            isSubmitting = true;
            btnSubmit.disabled = true;
            btnSubmit.classList.add("loading");

            if (!window.emailjs || typeof window.emailjs.sendForm !== "function" || !EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
                btnSubmit.classList.remove("loading");
                btnSubmit.disabled = false;
                isSubmitting = false;
                showSubmitError(window.LuddiesI18n && window.LuddiesI18n.getLang() === "en"
                    ? "The contact form is not connected yet. Please use the email address shown in Contact."
                    : "El formulario aún no está conectado. Escríbenos al correo que aparece en Contacto.");
                return;
            }

            window.emailjs
                .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
                .then(function () {
                    btnSubmit.classList.remove("loading");
                    btnSubmit.disabled = false;
                    isSubmitting = false;
                    form.style.display = "none";
                    successBanner.classList.add("visible");
                })
                .catch(function (err) {
                    if (window.console && console.error) {
                        console.error("[contact-form] EmailJS error:", err);
                    }
                    btnSubmit.classList.remove("loading");
                    btnSubmit.disabled = false;
                    isSubmitting = false;
                    showSubmitError(getSubmitErrorMessage());
                });
        });

        btnNew.addEventListener("click", function () {
            form.reset();
            form.style.display = "";
            successBanner.classList.remove("visible");
            charCounter.textContent = "0 / 500";
            fields.forEach(function (field) {
                field.classList.remove("is-valid", "is-invalid");
                var nodes = getErrorNodes(field);
                if (nodes.container) nodes.container.classList.remove("visible");
            });
            hideSubmitError();
        });
    });
})();
