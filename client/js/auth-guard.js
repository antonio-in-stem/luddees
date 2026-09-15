

(function () {
    "use strict";

    if (!window.LuddiesAuth) return;

    var path = window.location.pathname || "";

    function isPublicPage(p) {
        return /(?:^|[\\/])(index|catalog|product|about-us|contact|terms|privacy)\.html$/i.test(p);
    }

    var isLogin = /login\.html$/i.test(path);
    var isRegister = /register\.html$/i.test(path);
    var isAuthPage = isLogin || isRegister;
    var isAdminPage = /admin\.html$/i.test(path);
    var session = window.LuddiesAuth.getSession();

    if (isAuthPage) {
        if (session) {
            window.location.replace("index.html");
        }
        return;
    }

    if (!session && !isPublicPage(path)) {
        var ret = encodeURIComponent(window.location.href);
        window.location.replace("login.html?return=" + ret);
        return;
    }

    if (isAdminPage && (!session || session.role !== "admin")) {
        window.location.replace("index.html");
    }
})();
