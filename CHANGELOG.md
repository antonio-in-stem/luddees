# Changelog

Notable changes to Luddies are documented in this file. The project follows
[Semantic Versioning](https://semver.org/).

## [1.0.1] - 2026-09-14

### Fixed

- Unified price parsing so administration and checkout preserve thousands and
  decimal separators consistently.
- Treated an empty API catalog as authoritative instead of restoring stale demo
  products.
- Preserved intentional product deletions when reloading the static demo.
- Reconciled browser authentication with the server session and cleared expired
  sessions after unauthorized responses.
- Kept the administrative user directory in memory and removed private client
  data during logout.
- Synchronized all 35 browser catalog products with the MySQL demonstration seed.

### Changed

- Removed internal review and visual production documents from the release tree.
- Added automated regression coverage and a catalog seed parity check.

## [1.0.0] - 2026-09-14

### Added

- Bilingual multi-page experience for catalog, detail, contact, and legal pages.
- Registration, session, selection, demo checkout, and simulated payment flows.
- Administrative product and user interfaces.
- Spring Boot API with MySQL persistence and isolated H2 tests.
- Luddies visual system, original renders, and responsive behavior.
- Automated formatting, client validation, JavaScript tests, and Java tests.

### Security and quality

- Applied server-side administrative authorization and hardened sessions.
- Moved sensitive configuration to environment variables and disabled unsafe
  sample accounts.
- Locked payment to fictional data without card persistence or real charges.
- Reviewed routes, links, accessibility, privacy, and responsive behavior.

[1.0.1]: https://github.com/antonio-in-stem/luddees/releases/tag/v1.0.1
[1.0.0]: https://github.com/antonio-in-stem/luddees/releases/tag/v1.0.0
