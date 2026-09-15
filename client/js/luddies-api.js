

(function () {
    "use strict";

    function base() {
        var c = window.LuddiesConfig || {};
        return String(c.apiBaseUrl == null ? "" : c.apiBaseUrl).trim().replace(/\/+$/, "");
    }

    function uses() {
        return base().length > 0;
    }

    function req(method, path, body) {
        var url = base() + path;
        var headers = { Accept: "application/json" };
        if (method !== "GET" && method !== "DELETE") {
            headers["Content-Type"] = "application/json";
        }
        var opts = { method: method, headers: headers };
        if (body != null && method !== "GET" && method !== "DELETE") {
            opts.body = JSON.stringify(body);
        }
        return fetch(url, opts).then(function (res) {
            return res.text().then(function (text) {
                var data = null;
                if (text) {
                    try {
                        data = JSON.parse(text);
                    } catch (e1) {
                        data = { _raw: text };
                    }
                }
                if (!res.ok) {
                    var err = new Error((data && data.error) || res.statusText || "http_error");
                    err.status = res.status;
                    err.body = data;
                    throw err;
                }
                return data;
            });
        });
    }

    window.LuddiesApi = {
        uses: uses,
        base: base,
        getJson: function (path) {
            return req("GET", path, null);
        },
        postJson: function (path, body) {
            return req("POST", path, body);
        },
        putJson: function (path, body) {
            return req("PUT", path, body);
        },
        delete: function (path) {
            return req("DELETE", path, null);
        }
    };
})();
