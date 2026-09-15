

(function () {
    "use strict";

    window.LuddiesConfig = window.LuddiesConfig || {};
    if (window.LuddiesConfig.apiBaseUrl == null) {
        window.LuddiesConfig.apiBaseUrl = "";
    }

    if (
        !window.__LUDDIES_CONFIG_LOADED__ &&
        typeof location !== "undefined" &&
        (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ) {
        if (!String(window.LuddiesConfig.apiBaseUrl || "").trim()) {
            window.LuddiesConfig.apiBaseUrl = "http://localhost:8080";
        }
    }

    var KEYS = window.LuddiesStorageKeys;
    if (!KEYS) {
        console.error("[LuddiesAuth] LuddiesStorageKeys missing");
    }

    var SEED_PASSWORD = "123456";
    var RESERVED_ADMIN = "admin@luddies.com.mx";
    var apiUsers = [];

    function usesApi() {
        return window.LuddiesApi && window.LuddiesApi.uses();
    }

    function readJson(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            if (!raw) return fallback;
            return JSON.parse(raw);
        } catch (e) {
            return fallback;
        }
    }

    function writeJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function ensureUsers() {
        if (usesApi()) return;
        var users = readJson(KEYS.USERS, null);
        if (users && users.length) return;
        var seed = [
            {
                id: "u-admin",
                fullName: "Luddies Admin",
                phone: "5550000000",
                email: RESERVED_ADMIN,
                role: "admin",
                password: SEED_PASSWORD
            },
            {
                id: "u-user",
                fullName: "Demo User",
                phone: "5550000001",
                email: "user@luddies.com.mx",
                role: "user",
                password: SEED_PASSWORD
            }
        ];
        writeJson(KEYS.USERS, seed);
    }

    function ensureCatalog() {
        if (usesApi()) return;
        if (localStorage.getItem(KEYS.CATALOG_INITIALIZED) === "1") return;
        var p = readJson(KEYS.PRODUCTS, null);
        var seed = window.LUDDIES_CATALOG_SEED;
        if (!seed || !seed.length) {
            console.error("[LuddiesAuth] LUDDIES_CATALOG_SEED missing; load catalog-seed.js first");
            return;
        }
        if (Array.isArray(p)) {
            localStorage.setItem(KEYS.CATALOG_INITIALIZED, "1");
            return;
        }
        writeJson(
            KEYS.PRODUCTS,
            seed.map(function (row) {
                return Object.assign({ custom: false, purchasable: 1 }, row);
            })
        );
        localStorage.setItem(KEYS.CATALOG_INITIALIZED, "1");
    }

    function init() {
        if (!KEYS) return;
        if (usesApi()) {
            localStorage.removeItem(KEYS.USERS);
        }
        if (window.console && console.info && !usesApi()) {
            console.info(
                "[Luddies] Modo demo: apiBaseUrl vacío. Registro/login y datos van a localStorage. " +
                    "Edita client/js/config.js y define apiBaseUrl (p. ej. http://localhost:8080) para usar MySQL."
            );
        }
        ensureUsers();
        ensureCatalog();
    }

    function getSession() {
        return readJson(KEYS.SESSION, null);
    }

    function setSession(user) {
        if (!user) {
            localStorage.removeItem(KEYS.SESSION);
            return;
        }
        var uid = user.id != null && user.id !== "" ? user.id : user.userId;
        writeJson(KEYS.SESSION, {
            userId: uid,
            email: user.email,
            role: user.role,
            fullName: user.fullName
        });
    }

    function clearPrivateClientState() {
        apiUsers = [];
        localStorage.removeItem(KEYS.SESSION);
        localStorage.removeItem(KEYS.USERS);
        sessionStorage.removeItem("luddies.payment_stub");
        sessionStorage.removeItem("luddies.payment_receipt");
        sessionStorage.removeItem("luddies.checkout_profile");
        sessionStorage.removeItem("luddies.contact_prefill");
    }

    function reconcileSession() {
        if (!usesApi()) return Promise.resolve(getSession());
        if (!getSession()) return Promise.resolve(null);
        return window.LuddiesApi.getJson("/api/auth/session")
            .then(function (body) {
                var user = mapAuthUserBody(body);
                if (!user) {
                    clearPrivateClientState();
                    return null;
                }
                setSession(user);
                return getSession();
            })
            .catch(function (error) {
                if (error && error.status === 401) {
                    clearPrivateClientState();
                    return null;
                }
                throw error;
            });
    }

    function getUsers() {
        if (usesApi()) return apiUsers.slice();
        return readJson(KEYS.USERS, []).slice();
    }

    function getUserByEmail(email) {
        var e = (email || "").trim().toLowerCase();
        return getUsers().find(function (u) {
            return u.email.toLowerCase() === e;
        });
    }

    function mapApiUserRow(u) {
        var roleName = (u.role && u.role.name) || "USER";
        var role = String(roleName).toUpperCase() === "ADMIN" ? "admin" : "user";
        return {
            id: String(u.id),
            fullName: u.fullName || "",
            email: u.email || "",
            role: role,
            password: ""
        };
    }

    function mapAuthUserBody(body) {
        if (!body || body.id == null) {
            return null;
        }
        return {
            id: String(body.id),
            fullName: body.fullName || "",
            email: body.email || "",
            role: body.role || "user",
            phone: (body.phoneDial || "") + (body.phoneNumber || ""),
            password: ""
        };
    }

    function syncLogin(email, password) {
        var u = getUserByEmail(email);
        if (!u || u.password !== password) {
            return { ok: false, error: "invalid_credentials" };
        }
        setSession(u);
        return { ok: true, user: u };
    }

    function login(email, password) {
        if (usesApi()) {
            return window.LuddiesApi
                .postJson("/api/auth/login", { email: email, password: password })
                .then(function (body) {
                    var u = mapAuthUserBody(body);
                    if (!u) {
                        return { ok: false, error: "invalid_credentials" };
                    }
                    setSession(u);
                    return { ok: true, user: u };
                })
                .catch(function (err) {
                    var code = (err.body && err.body.error) || "invalid_credentials";
                    return { ok: false, error: code };
                });
        }
        return Promise.resolve(syncLogin(email, password));
    }

    function logout() {
        var request = usesApi() ? window.LuddiesApi.postJson("/api/auth/logout", {}) : Promise.resolve();
        return request.then(clearPrivateClientState, clearPrivateClientState);
    }

    function syncRegister(payload) {
        if (!payload || !payload.email) return { ok: false, error: "invalid_payload" };
        var email = payload.email.trim().toLowerCase();
        if (email === RESERVED_ADMIN) {
            return { ok: false, error: "reserved_email" };
        }
        if (getUserByEmail(email)) {
            return { ok: false, error: "email_taken" };
        }
        var users = getUsers();
        var id = "u-" + String(Date.now());
        users.push({
            id: id,
            fullName: (payload.fullName || "").trim(),
            phone: (payload.phone || "").trim(),
            email: email,
            role: "user",
            password: payload.password
        });
        writeJson(KEYS.USERS, users);
        return { ok: true, user: getUserByEmail(email) };
    }

    function register(payload) {
        if (usesApi()) {
            return window.LuddiesApi
                .postJson("/api/auth/register", {
                    fullName: (payload && payload.fullName) || "",
                    phone: (payload && payload.phone) || "",
                    email: (payload && payload.email) || "",
                    password: (payload && payload.password) || ""
                })
                .then(function (body) {
                    var u = mapAuthUserBody(body);
                    if (!u) {
                        return { ok: false, error: "invalid_payload" };
                    }
                    return { ok: true, user: u };
                })
                .catch(function (err) {
                    var code = (err.body && err.body.error) || "invalid_payload";
                    if (code === "email_taken") return { ok: false, error: "email_taken" };
                    if (code === "reserved_email") return { ok: false, error: "reserved_email" };
                    return { ok: false, error: code };
                });
        }
        return Promise.resolve(syncRegister(payload));
    }

    function syncDeleteUser(userId, actingUserId) {
        var users = getUsers();
        var actor = users.find(function (u) {
            return u.id === actingUserId;
        });
        if (!actor || actor.role !== "admin") {
            return { ok: false, error: "forbidden" };
        }
        var target = users.find(function (u) {
            return u.id === userId;
        });
        if (!target) return { ok: false, error: "not_found" };
        if (target.role === "admin") {
            return { ok: false, error: "cannot_delete_admin" };
        }
        if (target.id === actor.id) {
            return { ok: false, error: "cannot_delete_self" };
        }
        writeJson(
            KEYS.USERS,
            users.filter(function (u) {
                return u.id !== userId;
            })
        );
        return { ok: true };
    }

    function deleteUser(userId, actingUserId) {
        if (usesApi()) {
            if (String(userId) === String(actingUserId)) {
                return Promise.resolve({ ok: false, error: "cannot_delete_self" });
            }
            return window.LuddiesApi
                .delete("/api/users/" + encodeURIComponent(String(userId)))
                .then(function () {
                    return { ok: true };
                })
                .catch(function () {
                    return { ok: false, error: "forbidden" };
                });
        }
        return Promise.resolve(syncDeleteUser(userId, actingUserId));
    }

    function getProducts() {
        return readJson(KEYS.PRODUCTS, window.LUDDIES_CATALOG_SEED ? window.LUDDIES_CATALOG_SEED.slice() : []);
    }

    function loadUsers() {
        if (!usesApi()) {
            return Promise.resolve(getUsers());
        }
        return window.LuddiesApi.getJson("/api/users").then(function (list) {
            var mapped = (list || []).map(mapApiUserRow);
            apiUsers = mapped;
            return mapped;
        });
    }

    function loadProducts() {
        if (!usesApi()) {
            return Promise.resolve(getProducts());
        }
        if (!window.LuddiesCatalogApi || !window.LuddiesCatalogApi.mapApiProductToClient) {
            console.error("[LuddiesAuth] LuddiesCatalogApi missing");
            return Promise.resolve(getProducts());
        }
        return Promise.all([
            window.LuddiesApi.getJson("/api/products"),
            window.LuddiesApi.getJson("/api/categories")
        ]).then(function (pair) {
            var products = pair[0] || [];
            return Promise.all(
                products.map(function (p) {
                    return window.LuddiesApi
                        .getJson("/api/product-categories/product/" + p.id)
                        .then(function (rows) {
                            var slugs = (rows || [])
                                .map(function (row) {
                                    return row && row.category && row.category.slug;
                                })
                                .filter(Boolean);
                            return window.LuddiesCatalogApi.mapApiProductToClient(p, slugs);
                        })
                        .catch(function () {
                            return window.LuddiesCatalogApi.mapApiProductToClient(p, []);
                        });
                })
            );
        }).then(function (rows) {
            rows = Array.isArray(rows) ? rows : [];
            writeJson(KEYS.PRODUCTS, rows);
            return rows;
        });
    }

    function saveProducts(list) {
        writeJson(KEYS.PRODUCTS, list);
    }

    function nextProductId(list) {
        var max = 0;
        list.forEach(function (p) {
            var n = parseInt(p.id, 10);
            if (!isNaN(n) && n > max) max = n;
        });
        return String(max + 1);
    }

    function syncSaveProduct(product) {
        var list = getProducts();
        var id = product.id;
        if (!id) {
            id = nextProductId(list);
        }
        var now = Date.now();
        var row = {
            id: String(id),
            custom: true,
            img: product.img || "",
            category: (product.category || "science").toLowerCase(),
            purchasable: product.purchasable === 0 || product.purchasable === "0" ? 0 : 1,
            labels: product.labels && product.labels.es && product.labels.en ? product.labels : null
        };
        if (!row.labels) {
            return { ok: false, error: "labels_required" };
        }
        var nameKey = "cat_dyn_" + id + "_name";
        var descKey = "cat_dyn_" + id + "_desc";
        var metaKey = "cat_dyn_" + id + "_meta";
        var priceKey = "cat_dyn_" + id + "_price";
        row.name = nameKey;
        row.description = descKey;
        row.meta = metaKey;
        row.price = priceKey;

        var idx = list.findIndex(function (p) {
            return String(p.id) === String(id);
        });
        if (idx === -1) {
            row.createdAt = now;
            row.updatedAt = now;
            list.push(row);
        } else {
            var prev = list[idx] || {};
            row.createdAt = prev.createdAt || now;
            row.updatedAt = now;
            row.apiIsCustom = prev.apiIsCustom;
            row.apiIsActive = prev.apiIsActive;
            list[idx] = row;
        }
        saveProducts(list);
        return { ok: true, product: row };
    }

    function saveProduct(product) {
        if (!usesApi()) {
            return Promise.resolve(syncSaveProduct(product));
        }
        if (!window.LuddiesCatalogApi) {
            return Promise.resolve({ ok: false, error: "labels_required" });
        }
        var tokens = [];
        (product.category || "")
            .toLowerCase()
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .forEach(function (slug) {
                if (tokens.indexOf(slug) === -1) tokens.push(slug);
            });
        var existing =
            getProducts().find(function (p) {
                return String(p.id) === String(product.id || "");
            }) || null;
        var payload = window.LuddiesCatalogApi.mapFormDataToProductPayload(product, existing);
        var idStr = product.id ? String(product.id) : null;
        var saveReq = idStr
            ? window.LuddiesApi.putJson("/api/products/" + encodeURIComponent(idStr), payload)
            : window.LuddiesApi.postJson("/api/products", payload);

        function labelFromSlug(slug) {
            return String(slug || "")
                .replace(/[-_]+/g, " ")
                .replace(/\b\w/g, function (ch) {
                    return ch.toUpperCase();
                });
        }

        function categoryMap(cats) {
            var slugTo = {};
            (cats || []).forEach(function (c) {
                if (c && c.slug) slugTo[String(c.slug).toLowerCase()] = c;
            });
            return slugTo;
        }

        function ensureCategories(tokensToEnsure) {
            return window.LuddiesApi.getJson("/api/categories").then(function (cats) {
                var slugTo = categoryMap(cats);
                var missing = tokensToEnsure.filter(function (slug) {
                    return !slugTo[slug];
                });
                if (!missing.length) return slugTo;

                return Promise.all(
                    missing.map(function (slug) {
                        var label = labelFromSlug(slug);
                        return window.LuddiesApi
                            .postJson("/api/categories", {
                                slug: slug,
                                nameEs: label,
                                nameEn: label,
                                active: true
                            })
                            .then(function (created) {
                                if (created && created.slug) {
                                    slugTo[String(created.slug).toLowerCase()] = created;
                                }
                            });
                    })
                ).then(function () {
                    return slugTo;
                });
            });
        }

        return saveReq
            .then(function (saved) {
                var sid = saved && saved.id != null ? saved.id : idStr;
                return window.LuddiesApi
                    .delete("/api/product-categories/product/" + encodeURIComponent(String(sid)))
                    .catch(function () {
                        return null;
                    })
                    .then(function () {
                        return ensureCategories(tokens).then(function (slugTo) {
                            var ops = [];
                            tokens.forEach(function (slug) {
                                var cat = slugTo[slug];
                                if (!cat) return;
                                ops.push(
                                    window.LuddiesApi.postJson("/api/product-categories", {
                                        product: { id: sid },
                                        category: { id: cat.id }
                                    })
                                );
                            });
                            return Promise.all(ops);
                        });
                    })
                    .then(function () {
                        return loadProducts();
                    })
                    .then(function (list) {
                        var row = (list || []).find(function (x) {
                            return String(x.id) === String(sid);
                        });
                        return { ok: true, product: row || { id: String(sid), custom: true, labels: product.labels } };
                    })
                    .catch(function (err) {
                        err.luddiesCode = "product_category_save_failed";
                        throw err;
                    });
            })
            .catch(function (err) {
                if (window.console && console.error) {
                    console.error("[LuddiesAuth] saveProduct failed", err);
                }
                var code = (err && err.luddiesCode) || (err && err.body && err.body.error) || "product_save_failed";
                return { ok: false, error: code, status: err && err.status };
            });
    }

    function syncDeleteProduct(productId) {
        var list = getProducts();
        var next = list.filter(function (p) {
            return String(p.id) !== String(productId);
        });
        if (next.length === list.length) return { ok: false, error: "not_found" };
        saveProducts(next);
        return { ok: true };
    }

    function deleteProduct(productId) {
        if (usesApi()) {
            return window.LuddiesApi
                .delete("/api/products/" + encodeURIComponent(String(productId)))
                .then(function () {
                    return loadProducts().then(function () {
                        return { ok: true };
                    });
                })
                .catch(function () {
                    return { ok: false, error: "not_found" };
                });
        }
        return Promise.resolve(syncDeleteProduct(productId));
    }

    function isAdmin() {
        var s = getSession();
        return s && s.role === "admin";
    }

    function syncProductLabelsToI18n() {
        if (!window.LuddiesI18n || !window.LuddiesI18n.translations) return;
        getProducts().forEach(function (product) {
            if (!product || !product.custom || !product.labels) return;
            if (!product.labels.es || !product.labels.en) return;
            var id = String(product.id);
            var keys = {
                n: "cat_dyn_" + id + "_name",
                d: "cat_dyn_" + id + "_desc",
                m: "cat_dyn_" + id + "_meta",
                p: "cat_dyn_" + id + "_price"
            };
            window.LuddiesI18n.translations.es[keys.n] = product.labels.es.name || "";
            window.LuddiesI18n.translations.en[keys.n] = product.labels.en.name || "";
            window.LuddiesI18n.translations.es[keys.d] = product.labels.es.description || "";
            window.LuddiesI18n.translations.en[keys.d] = product.labels.en.description || "";
            window.LuddiesI18n.translations.es[keys.m] = product.labels.es.meta || "";
            window.LuddiesI18n.translations.en[keys.m] = product.labels.en.meta || "";
            window.LuddiesI18n.translations.es[keys.p] = product.labels.es.price || "";
            window.LuddiesI18n.translations.en[keys.p] = product.labels.en.price || "";
        });
    }

    init();

    window.LuddiesAuth = {
        init: init,
        usesApi: usesApi,
        loadProducts: loadProducts,
        loadUsers: loadUsers,
        getSession: getSession,
        setSession: setSession,
        reconcileSession: reconcileSession,
        clearPrivateClientState: clearPrivateClientState,
        getUsers: getUsers,
        getUserByEmail: getUserByEmail,
        login: login,
        logout: logout,
        register: register,
        deleteUser: deleteUser,
        getProducts: getProducts,
        saveProduct: saveProduct,
        deleteProduct: deleteProduct,
        isAdmin: isAdmin,
        syncProductLabelsToI18n: syncProductLabelsToI18n,
        RESERVED_ADMIN_EMAIL: RESERVED_ADMIN
    };
})();
