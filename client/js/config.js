

window.__LUDDIES_CONFIG_LOADED__ = true;

(function () {
    var explicitApiUrl = window.__LUDDIES_API_BASE_URL__;
    var isHttp = window.location.protocol === "http:" || window.location.protocol === "https:";
    var isLocalHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    var isStaticPreview = (isLocalHost && window.location.port && window.location.port !== "8080")
        || window.location.hostname.endsWith(".github.io");

    window.LuddiesConfig = {
        apiBaseUrl: explicitApiUrl != null
            ? String(explicitApiUrl).replace(/\/$/, "")
            : (isHttp && !isStaticPreview ? window.location.origin : ""),

        brandLogoUrl: "",
        emailjs: {
            publicKeyContact: "",
            serviceIdContact: "",
            templateIdContact: "",

        },
    };
})();
