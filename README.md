# Comment Tooltip Linker

Link and reference comments across multiple files using tags with hover tooltips.

## Why This Extension?

A function is often implemented in one file but used across dozens of files. When adding functionality using patterns like `.addHook()` to existing modules, hovering over the function shows the original module's documentation rather than context about how it fits into your specific workflow. Sometimes you need to understand the overall flow rather than just the individual function's behavior.

For all these reasons, when writing helpful comments for future me and other developers, explanations about a single feature end up scattered across dozens or even hundreds of files. The moment you need to modify that feature, finding and updating all the distributed comments becomes tedious and error-prone. Eventually, the comments become inconsistent with the actual implementation.

If we can link comments to provide a single source of truth referenced from multiple locations, updating the feature only requires updating the comment attached to the core implementation - and all references automatically reflect the changes. This is why I created this extension.

## Features

- Create comment anchors using `// @cmt-anchor id` syntax
- Reference anchors from other files using `// @cmt-link id` syntax  
- Hover over `@cmt-link` tags to see the full comment content in a tooltip
- Support for multi-line comments
- Works with many languages using C-style comments (`//`), including JavaScript, TypeScript, C/C++, C#, Java, Go, Rust, and more.

## Usage

### Creating an Anchor
```javascript
// @cmt-anchor auth-flow User authentication process
// 1. Token validation (JWT decode and signature verification)
// 2. User permission check (role-based)
// 3. Session renewal (every 15 minutes)
// 4. Audit logging (for security purposes)
//
// Important notes:
// - Auto-refresh attempt on token expiration
// - Account temporary lock after 3 failures
// - IP whitelist check required
function authenticateUser(token) {
    // Implementation
}
```

### Linking to an Anchor
```javascript
// middleware/auth-middleware.js
/**
 * Express authentication middleware
 * @cmt-link auth-flow  // Hover here to see the full auth flow documentation
 */
function authMiddleware(req, res, next) {
    // Implementation
}
```

## How it Works

1. The extension scans all supported files (e.g., `.js`, `.ts`, `.c`, `.java`, etc.) in your workspace.
2. It builds a cache of all `@cmt-anchor id` comments and their content.
3. When you hover over `@cmt-link id`, it shows the corresponding anchor content.
4. The cache automatically updates when files are modified.

## Requirements

- VSCode 1.74.0 or higher
- A project using one of the supported languages (JavaScript, TypeScript, C, C++, C#, Java, Go, Rust, PHP, Swift, Kotlin, etc.)

## Installation

Install from the VSCode Extension Marketplace or search for "Comment Tooltip Linker" in the Extensions view.

## Release Notes

### 1.1.0

- **Multi-language Support:** Added support for a wide range of languages using C-style comments (C++, Java, C#, Go, Rust, etc.).
- **Dynamic Language Handling:** Refactored the extension to easily support new languages in the future.

### 1.0.0

Initial release with basic anchor and link functionality.

## Contributing

This is a simple extension created to solve a specific need. While I may not be able to actively maintain this project long-term, I'm happy if this idea inspires others to create better versions or fork this project to continue development.

If you find bugs or want to add features, feel free to:
- Fork this repository and create your own version
- Use this code as inspiration for a more robust solution

The code is provided as-is, and anyone is welcome to take this concept further!

## License

MIT