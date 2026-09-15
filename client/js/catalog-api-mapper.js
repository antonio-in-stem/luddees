

(function () {
    "use strict";

    function boolFromApi(v) {
        if (v === true || v === 1 || v === "1") return true;
        if (v === false || v === 0 || v === "0") return false;
        return !!v;
    }

    function isActiveFromApi(api) {
        if (api.isActive !== undefined) return boolFromApi(api.isActive);
        if (api.active !== undefined) return boolFromApi(api.active);
        return true;
    }

    function isCustomFromApi(api) {
        if (api.isCustom !== undefined) return boolFromApi(api.isCustom);
        if (api.custom !== undefined) return boolFromApi(api.custom);
        return false;
    }

    function parseMoneyAmount(a, b) {
        var money = window.LuddiesMoney;
        if (!money || !money.parsePrice) return NaN;
        var x = money.parsePrice(String(a || ""));
        if (Number.isFinite(x)) return x;
        var y = money.parsePrice(String(b || ""));
        if (Number.isFinite(y)) return y;
        return NaN;
    }

    function productAmount(form, es, en) {
        var explicit = Number(form.priceAmount);
        if (Number.isFinite(explicit) && explicit >= 0) return explicit;
        var parsed = parseMoneyAmount(es.price, en.price);
        if (Number.isFinite(parsed) && parsed >= 0) return parsed;
        return 0;
    }

    function mapApiProductToClient(api, categorySlugs) {
        var id = String(api.id);
        var slugs = (categorySlugs || []).filter(Boolean);
        var created = api.createdAt ? new Date(api.createdAt).getTime() : Date.now();
        var updated = api.updatedAt ? new Date(api.updatedAt).getTime() : created;
        return {
            id: id,
            img: api.imageUrl || "",
            category: slugs.join(" "),
            custom: true,
            purchasable: boolFromApi(api.purchasable) ? 1 : 0,
            createdAt: created,
            updatedAt: updated,
            apiIsCustom: isCustomFromApi(api),
            apiIsActive: isActiveFromApi(api),
            labels: {
                es: {
                    name: api.titleEs || "",
                    description: api.descriptionEs || "",
                    meta: api.metaEs || "",
                    price: api.priceDisplayEs || ""
                },
                en: {
                    name: api.titleEn || "",
                    description: api.descriptionEn || "",
                    meta: api.metaEn || "",
                    price: api.priceDisplayEn || ""
                }
            }
        };
    }

    function mapFormDataToProductPayload(form, existing) {
        var labels = form.labels || {};
        var es = labels.es || {};
        var en = labels.en || {};
        var amount = productAmount(form, es, en);
        var isCustom = existing && existing.apiIsCustom !== undefined ? !!existing.apiIsCustom : true;
        var isActive = existing && existing.apiIsActive !== undefined ? !!existing.apiIsActive : true;
        return {
            titleEs: es.name || "",
            titleEn: en.name || "",
            metaEs: es.meta || "",
            metaEn: en.meta || "",
            descriptionEs: es.description || "",
            descriptionEn: en.description || "",
            priceAmount: Number(amount.toFixed(2)),
            currency: "MXN",
            priceDisplayEs: es.price || "",
            priceDisplayEn: en.price || "",
            imageUrl: form.img || "",
            purchasable: !(form.purchasable === 0 || form.purchasable === "0"),
            isCustom: isCustom,
            isActive: isActive
        };
    }

    window.LuddiesCatalogApi = {
        mapApiProductToClient: mapApiProductToClient,
        mapFormDataToProductPayload: mapFormDataToProductPayload,
        parseMoneyAmount: parseMoneyAmount
    };
})();
