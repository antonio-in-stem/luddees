(function () {
    "use strict";

    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var phoneRe = /^\+?[\d\s-]{8,20}$/;
    var nameRe = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
    var passwordRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    function setAlert(type, id, key) {
        var el = document.getElementById(id);
        if (!el) return;
        el.className = "alert alert-" + (type || "danger");
        if (key && window.LuddiesI18n && window.LuddiesI18n.t) {
            el.textContent = window.LuddiesI18n.t(key);
        }
        el.classList.remove("d-none");
    }

    function hideAlert(id) {
        var el = document.getElementById(id);
        if (el) el.classList.add("d-none");
    }

    function validate(data) {
        if (!data.fullName || data.fullName.length < 2 || !nameRe.test(data.fullName)) return "reg_error_name";
        if (!data.email || !emailRe.test(data.email)) return "reg_error_email";
        var minByCountry = {
            "+52":10,"+1":10,"+54":10,"+55":10,
            "+56":9,"+57":10,"+506":8,"+593":9,
            "+503":8,"+502":8,"+504":8,"+505":8,
            "+507":8,"+595":9,"+51":9,"+1809":10,
            "+598":8,"+58":10
        };
        var maxByCountry = {
            "+52":10,"+1":10,"+54":11,"+55":11,
            "+56":9,"+57":10,"+506":8,"+593":9,
            "+503":8,"+502":8,"+504":8,"+505":8,
            "+507":8,"+595":9,"+51":9,"+1809":10,
            "+598":9,"+58":11
        };
        var digitsOnly = data.rawPhone.replace(/\D/g, "");
        var min = minByCountry[data.country] || 8;
        var max = maxByCountry[data.country] || 11;
        if (digitsOnly.length < min || digitsOnly.length > max) return "reg_error_phone";
        if (!data.password || !passwordRe.test(data.password)) return "reg_error_password_len";
        if (data.password !== data.confirm) return "reg_error_password_match";
        return null;
    }

    document.addEventListener("DOMContentLoaded", function () {
        var form = document.getElementById("register-form");
        if (!form) return;

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            hideAlert("register-error-alert");
            var fullName = (document.getElementById("reg-fullname") && document.getElementById("reg-fullname").value) || "";
            var country = (document.getElementById("reg-country") && document.getElementById("reg-country").value) || "+52";
            var phone = (document.getElementById("reg-phone") && document.getElementById("reg-phone").value) || "";
            phone = phone.replace(/\D/g, "");
            var email = (document.getElementById("reg-email") && document.getElementById("reg-email").value) || "";
            var password = (document.getElementById("reg-password") && document.getElementById("reg-password").value) || "";
            var confirm = (document.getElementById("reg-confirm") && document.getElementById("reg-confirm").value) || "";
            var data = { fullName: fullName.trim(), phone: country + phone, rawPhone: phone, country: country, email: email.trim(), password: password, confirm: confirm };
            var err = validate(data);

            if (err) {
                setAlert("danger", "register-error-alert", err);
                return;
            }

            if (!window.LuddiesAuth) {
                setAlert("danger", "register-error-alert", "auth_error_generic");
                return;
            }

            if (data.email.toLowerCase() === window.LuddiesAuth.RESERVED_ADMIN_EMAIL) {
                setAlert("danger", "register-error-alert", "reg_error_reserved");
                return;
            }

            function handleRegisterResult(res) {
                if (res && res.ok) {
                    var json = JSON.stringify({
                        fullName: res.user.fullName,
                        phone: res.user.phone,
                        email: res.user.email,
                        role: res.user.role
                    });
                    try {
                        sessionStorage.setItem("luddies.register.json", json);
                    } catch (e2) {
                    }
                    window.location.href = "login.html?registered=1";
                    return;
                }
                if (res && res.error === "email_taken") {
                    setAlert("danger", "register-error-alert", "reg_error_taken");
                    return;
                }
                if (res && res.error === "reserved_email") {
                    setAlert("danger", "register-error-alert", "reg_error_reserved");
                    return;
                }
                if (res && res.error === "invalid_email") {
                    setAlert("danger", "register-error-alert", "reg_error_email");
                    return;
                }
                setAlert("danger", "register-error-alert", "auth_error_generic");
            }

            var resOrPromise = window.LuddiesAuth.register({
                fullName: data.fullName,
                phone: data.phone,
                email: data.email,
                password: data.password
            });

            if (resOrPromise && typeof resOrPromise.then === "function") {
                resOrPromise.then(handleRegisterResult);
            } else {
                handleRegisterResult(resOrPromise);
            }
        });

    });
})();
