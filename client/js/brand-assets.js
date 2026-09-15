

(function () {
    "use strict";

    var REL_LOGO = "../images/luddees/identity-v2/brand/luddies-mark-white.svg";
    var REL_ICON = "../images/luddees/identity-v2/brand/luddies-app-icon-slate-v2.png";

    var INLINE_LOGO =
        "data:image/svg+xml," +
        encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
                '<mask id="m"><rect width="64" height="64" fill="#fff"/><ellipse cx="25" cy="39" rx="3.4" ry="5.2"/><ellipse cx="41" cy="39" rx="3.4" ry="5.2"/><path d="M28.5 49.5c2.8 2.5 6.2 2.5 9 0" fill="none" stroke="#000" stroke-width="2.8" stroke-linecap="round"/></mask>' +
                '<g fill="#fff" mask="url(#m)"><path d="M14.5 30.5C10.8 20.7 10.8 8.2 17.7 4.1c3.8-2.2 7.1.7 8.6 5.5 2.3 7.4 1.3 15.3-.2 21.3l-11.6-.4Z"/><path d="M39.2 30.1c.1-6.6 2.1-14.9 7.9-18.2 4.1-2.4 8.4-.4 8.9 3.4.8 6.3-5.9 11.9-11.1 17.2l-5.7-2.4Z"/><path d="M7 40.3C7 26.8 17.4 20 32 20s25 6.8 25 20.3C57 54.7 46.6 61 32 61S7 54.7 7 40.3Z"/></g>' +
                "</svg>"
        );

    function scriptSrcContains(hint) {
        var list = document.getElementsByTagName("script");
        for (var i = list.length - 1; i >= 0; i--) {
            var s = list[i].getAttribute("src");
            if (s && s.indexOf(hint) !== -1) {
                return s;
            }
        }
        return null;
    }

    function absoluteFromHint(hint, relPath) {
        var src = scriptSrcContains(hint);
        if (!src) {
            return null;
        }
        var jsDir = new URL(src, window.location.href).href.replace(/[^/]+$/, "");
        return new URL(relPath, jsDir).href;
    }

    function fromPageDir(relPath) {
        try {
            var u = new URL(window.location.href);
            var path = u.pathname || "";
            var last = path.lastIndexOf("/");
            if (last < 0) {
                return null;
            }
            var dir = u.origin + path.slice(0, last + 1);
            return new URL(relPath, dir).href;
        } catch (e) {
            return null;
        }
    }

    function logoUrlFromApiBase() {
        try {
            var c = window.LuddiesConfig || {};
            var base = String(c.apiBaseUrl == null ? "" : c.apiBaseUrl).trim().replace(/\/+$/, "");
            if (!base) {
                return null;
            }
            return base + "/images/luddees/identity-v2/brand/luddies-mark-white.svg";
        } catch (e2) {
            return null;
        }
    }

    function logoUrl() {
        if (window.LuddiesConfig && typeof window.LuddiesConfig.brandLogoUrl === "string") {
            var c = window.LuddiesConfig.brandLogoUrl.trim();
            if (c) {
                return c;
            }
        }
        return (
            absoluteFromHint("brand-assets.js", REL_LOGO) ||
            absoluteFromHint("layout.js", REL_LOGO) ||
            fromPageDir(REL_LOGO) ||
            logoUrlFromApiBase() ||
            new URL(REL_LOGO, window.location.href).href
        );
    }

    function iconUrl() {
        return (
            absoluteFromHint("brand-assets.js", REL_ICON) ||
            absoluteFromHint("layout.js", REL_ICON) ||
            fromPageDir(REL_ICON) ||
            new URL(REL_ICON, window.location.href).href
        );
    }

    function fixIcon() {
        var icon = document.querySelector('link[rel="icon"]');
        if (!icon) {
            icon = document.createElement("link");
            icon.rel = "icon";
            document.head.appendChild(icon);
        }
        icon.type = "image/png";
        icon.href = iconUrl();
    }

    function fix(root) {
        var url = logoUrl();
        (root || document).querySelectorAll("img[data-luddies-brand-logo]").forEach(function (img) {
            var pictureSource = img.parentElement && img.parentElement.tagName === "PICTURE"
                ? img.parentElement.querySelector("source")
                : null;
            if (pictureSource) {
                pictureSource.srcset = url;
                pictureSource.type = "image/svg+xml";
            }
            img.onerror = function () {
                img.onerror = null;
                if (String(img.src || "").indexOf("data:image/svg+xml") === 0) {
                    return;
                }
                img.src = INLINE_LOGO;
            };
            img.src = url;
        });
    }

    window.LuddiesBrandAssets = {
        logoUrl: logoUrl,
        iconUrl: iconUrl,
        fix: fix
    };

    document.addEventListener("DOMContentLoaded", function () {
        fix(document);
        fixIcon();
    });
    document.addEventListener("luddies:layout-ready", function () {
        fix(document);
    });
    document.addEventListener("luddies:lang-changed", function () {
        fix(document);
    });
})();
