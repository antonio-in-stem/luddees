# Luddies Client

Multi-page frontend built with HTML, CSS, Bootstrap, and JavaScript. It preserves
the Luddies visual identity and existing renders while adapting their composition
for mobile screens without requiring separate images.

## Running the client

From `client/`, run `python -m http.server 5500` and open
<http://localhost:5500/>. Do not use `file://`, because the header and footer are
loaded as partial documents.

Two modes are selected in `js/config.js`:

- **Static demo:** localhost on a port other than 8080 and GitHub Pages. Catalog,
  users, and selections exist only in the browser. The synthetic accounts
  `admin@luddies.com.mx` and `user@luddies.com.mx` use `123456`. They are not
  server accounts. Use fictional data and never reuse a real password.
- **API:** Spring Boot served from the same origin. It uses MySQL, BCrypt, and a
  server session. Browser controls are presentation only; the API validates the
  session and administrative role.

For another static host, set `window.__LUDDIES_API_BASE_URL__ = ""` before
loading `config.js`. For API mode, serve client and server from the same origin.
Cross-origin frontend authentication is not supported in this release.

## Explicit limitations

Payment is a **demonstration**, not a payment gateway. Bank fields contain
fictional read-only values. No charge, persisted paid order, material delivery,
or confirmation email occurs. The generated reference identifies only the demo.

Contact delivery requires the public EmailJS values `publicKeyContact`,
`serviceIdContact`, and `templateIdContact` in `js/config.js`. Never place private
keys there. Without configuration, the form reports that delivery is unavailable
and points to the public contact email. Configure origin restrictions and abuse
protection in the provider before enabling it.

## Responsibilities

| File | Responsibility |
| --- | --- |
| `js/config.js` | Select demo or API mode and expose public configuration |
| `js/auth.js`, `js/auth-guard.js` | Session reconciliation and interface access |
| `js/auth-page.js` | Shared login and registration initialization |
| `js/layout.js`, `js/auth-ui.js` | Header, footer, and session-aware navigation |
| `js/catalog-*` | Catalog, filters, selection, and API mapping |
| `js/money.js` | Shared MXN parsing and presentation |
| `js/checkout.js` | Purchase information and four-item pagination |
| `js/payment.js` | Demonstration payment and confirmation state |
| `js/contact-form.js` | Validation and configured message delivery |
| `js/i18n.js`, `js/legal-translations.js` | Spanish and English translations |
| `style/pages/` | Page-specific styles |
| `style/responsive.css` | Shared mobile, tablet, focus, and reduced-motion behavior |

The main pages are home, catalog, product detail, about, contact, checkout,
payment, administration, login, registration, privacy, and terms. `pago.html`
preserves a compatibility redirect to the current payment page, while `404.html`
handles missing routes.

## Verification

From the repository root:

```shell
npm ci --ignore-scripts
npm run check
npm test
./gradlew test bootJar
```

The checks cover syntax, local references, IDs, image alternatives, first-party
comments, catalog seed parity, and authentication and payment regressions.

First-party code is self-documenting through expressive names and focused
functions. Preserve required third-party attribution and license notices.
