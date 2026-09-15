(function () {
    "use strict";
    document.addEventListener("DOMContentLoaded", function () {
        var notice = document.querySelector(".page-auth__demo-notice");
        if (notice) notice.hidden = !!(window.LuddiesApi && window.LuddiesApi.uses());
        if (window.LuddiesI18n) window.LuddiesI18n.applyTranslations(window.LuddiesI18n.getLang());
    });
})();
