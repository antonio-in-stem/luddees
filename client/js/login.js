(function () {
    "use strict";

    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function getReturnUrl() {
        var params = new URLSearchParams(window.location.search);
        var r = params.get("return");
        if (r) {
            try {
                var target = new URL(r, window.location.href);
                if (target.origin === window.location.origin && /^https?:$/.test(target.protocol)) {
                    return target.href;
                }
            } catch (error) {}
        }
        return "index.html";
    }

    function showAlert(id, key) {
        var el = document.getElementById(id);
        if (!el) return;
        if (key && window.LuddiesI18n && window.LuddiesI18n.t) el.textContent = window.LuddiesI18n.t(key);
        el.classList.remove("d-none");
    }

    function hideAlert(id) {
        var el = document.getElementById(id);
        if (el) el.classList.add("d-none");
    }

    function setFieldError(input, show) {
        if (!input) return;
        input.classList.toggle("is-invalid", show);
        input.classList.toggle("is-valid", !show && input.value.trim() !== "");
    }

    document.addEventListener("DOMContentLoaded", function () {
        var reg = new URLSearchParams(window.location.search).get("registered");
        if (reg === "1") {
            var ok = document.getElementById("login-success-alert");
            if (ok) {
                if (window.LuddiesI18n && window.LuddiesI18n.t) ok.textContent = window.LuddiesI18n.t("auth_register_success");
                ok.classList.remove("d-none");
            }
        }

        var form = document.getElementById("login-form");
        if (!form) return;

        var emailInput = document.getElementById("login-email");
        var passInput  = document.getElementById("login-password");

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            hideAlert("login-error-alert");

            var email = (emailInput && emailInput.value) || "";
            var pass  = (passInput  && passInput.value)  || "";
            var emailTrim = email.trim();

            var emailEmpty = emailTrim.length === 0;
            var passEmpty = pass.length === 0;
            var emailBadFormat = !emailEmpty && !emailRe.test(emailTrim);

            setFieldError(emailInput, emailEmpty || emailBadFormat);
            setFieldError(passInput, passEmpty);

            if (emailEmpty || passEmpty) {
                showAlert("login-error-alert", "auth_error_required");
                return;
            }
            if (emailBadFormat) {
                showAlert("login-error-alert", "reg_error_email");
                return;
            }

            if (!window.LuddiesAuth) { showAlert("login-error-alert", "auth_error_generic"); return; }

            function onLoginResult(res) {
                if (res && res.ok) {
                    window.location.href = getReturnUrl();
                    return;
                }
                setFieldError(emailInput, true);
                setFieldError(passInput, res && res.error === "invalid_email" ? false : true);
                var alertKey =
                    res && res.error === "invalid_email" ? "reg_error_email" : "auth_error_invalid";
                showAlert("login-error-alert", alertKey);
            }

            var resOrPromise = window.LuddiesAuth.login(emailTrim, pass);
            if (resOrPromise && typeof resOrPromise.then === "function") {
                resOrPromise.then(onLoginResult).catch(function () {
                    showAlert("login-error-alert", "auth_error_generic");
                });
            } else {
                onLoginResult(resOrPromise);
            }
        });

        [emailInput, passInput].forEach(function(inp) {
            if (!inp) return;
            inp.addEventListener("input", function() {
                setFieldError(inp, false);
                hideAlert("login-error-alert");
            });
        });
    });
})();
