# Internationalization strategy (ES / EN / FR)

## Decision

Use BCP 47 locale identifiers across the full stack and keep one canonical HTML
structure per page. The initial supported locales should be `es-MX`, `en-US`,
and `fr-FR`, with `es-MX` as the fallback.

The frontend remains vanilla JavaScript. Translation catalogs move out of the
large `client/js/i18n.js` file into one JSON resource per locale. The existing
`data-i18n`, `data-i18n-html`, `data-i18n-placeholder`, and `data-i18n-aria`
attributes remain the presentation contract, so adding French does not require
duplicating the twelve HTML pages.

## Contract

### Input

- A locale from the URL, the authenticated user's preference, or the browser's
  `Accept-Language` value, in that order.
- Translation keys referenced by the HTML and JavaScript.
- Localized product fields returned by the API.

### Processing

- Normalize aliases such as `es` to `es-MX`, `en` to `en-US`, and `fr` to
  `fr-FR` at the boundary.
- Load a complete JSON catalog for the active locale and fall back to `es-MX`
  only when a key is intentionally absent.
- Persist the selected locale on the user record when authenticated and in
  local storage for anonymous visitors.
- Format currency, dates, and numbers with `Intl` using the active locale;
  never store formatted values in the database.
- Return stable API error codes and translate their messages in the client.

### Output

- The document `lang` attribute and all marked UI content match the active
  locale.
- Product and legal content are presented in the requested locale.
- Orders retain the locale used at purchase time for reproducible receipts.

## Backend model changes for the implementation phase

- Replace the current `es`/`en` Java enums with BCP 47-compatible locale codes
  and add `fr-FR` through an explicit database migration.
- Model localized product copy as translations keyed by product and locale,
  rather than adding a new column for every language.
- Keep legal documents as versioned locale resources because they require
  independent review and publication dates.
- Expose the supported locale list from the API so the language selector and
  backend cannot drift.

## SEO and routing

For a production deployment, publish stable locale routes such as `/es-MX/`,
`/en-US/`, and `/fr-FR/`, with canonical and `hreflang` metadata. Client-side
text replacement alone is acceptable for the authenticated application, but it
is not sufficient for indexable landing, catalog, and legal pages. Those routes
should be rendered or prebuilt from the same catalogs during the later release
phase.

## Acceptance criteria

- Every catalog has exactly the same required keys in CI.
- No visible key names or mixed-language UI after navigation.
- Locale preference survives anonymous and authenticated sessions.
- Product, legal, validation, and error copy cover all three locales.
- Currency and dates use locale-aware formatting without changing stored data.
