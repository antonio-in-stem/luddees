(function () {
    "use strict";

    function parsePrice(priceText) {
        if (typeof priceText !== "string") return NaN;
        var match = priceText.match(/\$\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)(?![\d.,])/);
        if (!match) return NaN;
        var amount = Number(match[1].replace(/,/g, ""));
        return Number.isFinite(amount) && amount >= 0 ? amount : NaN;
    }

    function formatTotal(amount) {
        var language = window.LuddiesI18n ? window.LuddiesI18n.getLang() : "es";
        return "$" + Number(amount).toLocaleString(language === "en" ? "en-US" : "es-MX", {
            minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
            maximumFractionDigits: 2
        }) + " MXN";
    }

    window.LuddiesMoney = { parsePrice: parsePrice, formatTotal: formatTotal };
})();
