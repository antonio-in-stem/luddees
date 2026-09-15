

(function () {
    "use strict";

    var CANONICAL = [
        "science",
        "technology",
        "engineering",
        "mathematics",
        "neurodiversity",
        "certification",
        "physical",
        "dissidents"
    ];
    var PAGE_SIZE = 16;
    var activeFilters = new Set();
    var searchQuery = "";
    var currentPage = 1;
    var controlsBound = false;
    var urlFilterApplied = false;

    function getGridItems() {
        return Array.prototype.slice.call(
            document.querySelectorAll(".catalog-grid-item[data-catalog-cats]")
        );
    }

    function allFilterButtons() {
        return document.querySelectorAll(".catalog-filter-root [data-catalog-filter]");
    }

    function normalize(value) {
        var text = String(value || "").toLowerCase();
        if (text.normalize) {
            text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
        return text.replace(/\s+/g, " ").trim();
    }

    function removeDynamicFilterButtons() {
        document.querySelectorAll('.catalog-filter-btn[data-filter-dynamic="1"]').forEach(function (button) {
            button.remove();
        });
    }

    function injectDynamicFilterButtons() {
        if (!window.LuddiesAuth || !window.LuddiesAuth.getProducts) return;

        var found = {};
        window.LuddiesAuth.getProducts().forEach(function (product) {
            String((product && product.category) || "").toLowerCase().split(/\s+/).forEach(function (token) {
                if (token && CANONICAL.indexOf(token) === -1) found[token] = true;
            });
        });

        var stack = document.querySelector(".catalog-filter-stack");
        if (!stack) return;

        Object.keys(found).sort().forEach(function (token) {
            if (stack.querySelector('[data-catalog-filter="' + token + '"]')) return;
            var button = document.createElement("button");
            button.type = "button";
            button.className = "catalog-filter-btn";
            button.setAttribute("data-catalog-filter", token);
            button.setAttribute("data-filter-dynamic", "1");
            button.setAttribute("aria-pressed", "false");
            button.textContent = token;
            stack.appendChild(button);
        });
    }

    function itemMatches(item) {
        var categories = (item.getAttribute("data-catalog-cats") || "").split(/\s+/).filter(Boolean);
        var matchesCategory = activeFilters.size === 0 || categories.some(function (category) {
            return activeFilters.has(category);
        });
        if (!matchesCategory) return false;
        if (!searchQuery) return true;

        var searchable = normalize(item.textContent + " " + categories.join(" "));
        return searchable.indexOf(searchQuery) !== -1;
    }

    function updateFilterButtons() {
        var isAll = activeFilters.size === 0;
        allFilterButtons().forEach(function (button) {
            var value = button.getAttribute("data-catalog-filter");
            var isActive = value === "all" ? isAll : activeFilters.has(value);
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
    }

    function localeText(es, en) {
        return document.documentElement.lang === "en" ? en : es;
    }

    function updateResultCount(total, first, last) {
        var count = document.getElementById("catalog-results-count");
        if (!count) return;
        if (total === 0) {
            count.textContent = localeText("Sin resultados", "No results");
        } else if (total === 1) {
            count.textContent = localeText("1 activo", "1 asset");
        } else {
            count.textContent = localeText(
                "Mostrando " + first + "–" + last + " de " + total + " activos",
                "Showing " + first + "–" + last + " of " + total + " assets"
            );
        }
    }

    function paginationButton(label, page, options) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "catalog-pagination__button" + (options.active ? " active" : "");
        button.textContent = label;
        button.disabled = Boolean(options.disabled);
        button.setAttribute("data-catalog-page", String(page));
        if (options.ariaLabel) button.setAttribute("aria-label", options.ariaLabel);
        if (options.active) button.setAttribute("aria-current", "page");
        return button;
    }

    function renderPagination(totalPages) {
        var pagination = document.getElementById("catalog-pagination");
        if (!pagination) return;
        pagination.innerHTML = "";
        pagination.hidden = totalPages === 0;
        if (totalPages === 0) return;

        pagination.appendChild(paginationButton("←", currentPage - 1, {
            disabled: currentPage === 1,
            ariaLabel: localeText("Página anterior", "Previous page")
        }));

        for (var page = 1; page <= totalPages; page += 1) {
            pagination.appendChild(paginationButton(String(page), page, {
                active: page === currentPage,
                ariaLabel: localeText("Página " + page, "Page " + page)
            }));
        }

        pagination.appendChild(paginationButton("→", currentPage + 1, {
            disabled: currentPage === totalPages,
            ariaLabel: localeText("Página siguiente", "Next page")
        }));
    }

    function applyCatalogState() {
        var items = getGridItems();
        var matches = items.filter(itemMatches);
        var totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
        currentPage = Math.min(Math.max(currentPage, 1), totalPages);

        var start = (currentPage - 1) * PAGE_SIZE;
        var visible = new Set(matches.slice(start, start + PAGE_SIZE));
        items.forEach(function (item) {
            item.hidden = !visible.has(item);
        });

        updateFilterButtons();
        updateResultCount(matches.length, matches.length ? start + 1 : 0, Math.min(start + PAGE_SIZE, matches.length));
        renderPagination(matches.length ? totalPages : 0);

        var empty = document.getElementById("catalog-empty-state");
        if (empty) empty.hidden = matches.length !== 0;

        var clear = document.getElementById("catalog-search-clear");
        if (clear) clear.hidden = !searchQuery;
    }

    function applyUrlFilterOnce() {
        if (urlFilterApplied) return;
        urlFilterApplied = true;
        var filter = null;
        try {
            filter = new URLSearchParams(window.location.search).get("filter");
        } catch (error) {
            filter = null;
        }
        if (filter && document.querySelector('[data-catalog-filter="' + filter + '"]')) {
            activeFilters.add(filter);
        }
    }

    function bindControls() {
        if (controlsBound) return;
        controlsBound = true;

        var root = document.querySelector(".catalog-filter-root");
        var search = document.getElementById("catalog-search-input");
        var clear = document.getElementById("catalog-search-clear");
        var pagination = document.getElementById("catalog-pagination");

        if (root) {
            root.addEventListener("click", function (event) {
                var button = event.target.closest("[data-catalog-filter]");
                if (!button || !root.contains(button)) return;
                var value = button.getAttribute("data-catalog-filter");
                if (value === "all") {
                    activeFilters.clear();
                } else if (activeFilters.has(value)) {
                    activeFilters.delete(value);
                } else {
                    activeFilters.add(value);
                }
                currentPage = 1;
                applyCatalogState();
            });
        }

        if (search) {
            search.addEventListener("input", function () {
                searchQuery = normalize(search.value);
                currentPage = 1;
                applyCatalogState();
            });
        }

        if (clear && search) {
            clear.addEventListener("click", function () {
                search.value = "";
                searchQuery = "";
                currentPage = 1;
                applyCatalogState();
                search.focus();
            });
        }

        if (pagination) {
            pagination.addEventListener("click", function (event) {
                var button = event.target.closest("[data-catalog-page]");
                if (!button || button.disabled) return;
                currentPage = Number(button.getAttribute("data-catalog-page")) || 1;
                applyCatalogState();
                var discovery = document.getElementById("catalog-discovery");
                if (discovery) {
                    discovery.scrollIntoView({
                        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                        block: "start"
                    });
                }
            });
        }
    }

    function initCatalogFilter() {
        if (!document.querySelector(".catalog-filter-root")) return;
        removeDynamicFilterButtons();
        injectDynamicFilterButtons();
        bindControls();
        applyUrlFilterOnce();
        applyCatalogState();
    }

    document.addEventListener("luddies:catalog-items-mounted", initCatalogFilter);
    document.addEventListener("luddies:lang-changed", function () {
        window.setTimeout(applyCatalogState, 0);
    });

    window.LuddiesCatalogFilter = {
        init: initCatalogFilter,
        apply: applyCatalogState
    };
})();
