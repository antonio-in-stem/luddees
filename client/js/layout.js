

(function () {
    "use strict";

    const PARTIALS = {
        header: "partials/header.html",
        footer: "partials/footer.html",
    };
    const CACHE_PREFIX = "luddies:layout:v1:";

    function getScrollY() {
        return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }

    function initNavbarScroll() {
        const nav = document.querySelector("#site-header .navbar-glass");
        if (!nav) return;

        function onScroll() {
            nav.classList.toggle("navbar-glass--scrolled", getScrollY() > 16);
        }

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
    }

    function setActiveNav() {
        const page = document.body.getAttribute("data-site-page") || "";
        const header = document.getElementById("site-header");
        if (!header) return;

        header.querySelectorAll("[data-nav]").forEach(function (el) {
            el.classList.remove("nav-link-active");
            el.removeAttribute("aria-current");
        });

        const active = header.querySelector('[data-nav="' + page + '"]');
        if (active) {
            active.classList.add("nav-link-active");
            if (active.tagName === "A") {
                active.setAttribute("aria-current", "page");
            }
        }
    }

    function initGoTopButton() {
        const goTopContainer = document.querySelector(".lh-gotop-container");
        if (!goTopContainer) return;

        function onScrollGoTop() {
            goTopContainer.classList.toggle("lh-show", getScrollY() > 200);
        }

        onScrollGoTop();
        window.addEventListener("scroll", onScrollGoTop, { passive: true });
        goTopContainer.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    function fragmentFromHtmlFile(text) {
        const match = text.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        return match ? match[1].trim() : text;
    }

    function readCachedPartial(name) {
        try {
            return window.sessionStorage.getItem(CACHE_PREFIX + name);
        } catch (_error) {
            return null;
        }
    }

    function cachePartial(name, markup) {
        try {
            window.sessionStorage.setItem(CACHE_PREFIX + name, markup);
        } catch (_error) {

        }
    }

    async function fetchPartial(url) {
        const response = await fetch(url, { cache: "default" });
        if (!response.ok) throw new Error("Failed to load " + url);
        return fragmentFromHtmlFile(await response.text());
    }

    function fixBrandAssets(root) {
        if (window.LuddiesBrandAssets && typeof window.LuddiesBrandAssets.fix === "function") {
            window.LuddiesBrandAssets.fix(root);
        }
    }

    function markHeaderReady(headerEl) {
        fixBrandAssets(headerEl);
        setActiveNav();
        initNavbarScroll();
        initGoTopButton();
        window.LuddiesLayout.headerReady = true;
        document.dispatchEvent(new CustomEvent("luddies:layout-ready"));
    }

    function markFooterReady(footerEl) {
        fixBrandAssets(footerEl);
        window.LuddiesLayout.footerReady = true;
        document.dispatchEvent(new CustomEvent("luddies:footer-ready"));
    }

    async function hydratePartial(name, target, onReady) {
        const cachedMarkup = readCachedPartial(name);

        if (cachedMarkup) {
            target.innerHTML = cachedMarkup;
            onReady(target);

            fetchPartial(PARTIALS[name])
                .then(function (markup) { cachePartial(name, markup); })
                .catch(function (error) { console.warn("[Luddies layout]", error); });
            return;
        }

        try {
            const markup = await fetchPartial(PARTIALS[name]);
            target.innerHTML = markup;
            cachePartial(name, markup);
            onReady(target);
        } catch (error) {
            console.error("[Luddies layout]", error);
        }
    }

    function initializeLayout() {
        const headerEl = document.getElementById("site-header");
        const footerEl = document.getElementById("site-footer");

        if (headerEl) hydratePartial("header", headerEl, markHeaderReady);
        if (footerEl) hydratePartial("footer", footerEl, markFooterReady);
    }

    window.LuddiesLayout = {
        headerReady: false,
        footerReady: false,
    };

    initializeLayout();
})();
