# Changelog

All notable changes to this project will be documented in this file.

## [1.1.1] - 2025-08-05

### Fixed
- Updated `README.md` and `CHANGELOG.md` with the latest version information.

## [1.1.0] - 2025-08-05

### Added
- **Multi-language support:** The extension now works with a wide range of languages that use C-style `//` comments, including:
  - C, C++, C#, Java, Go, Rust, PHP, Swift, Kotlin, Dart, Objective-C, Scala.
- The anchor cache now scans for files with corresponding extensions (e.g., `.java`, `.cs`, `.go`).

### Changed
- Updated `package.json` activation events to include the new languages.
- Refactored `extension.js` to dynamically handle multiple languages and file extensions.

## [1.0.0] - Initial Release

- Basic functionality to create anchors (`@cmt-anchor`) and links (`@cmt-link`).
- Hover tooltips to display linked comment content.
- Support for JavaScript and TypeScript.

