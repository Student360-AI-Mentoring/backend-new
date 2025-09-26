# Documentation Overview

This directory contains comprehensive documentation for the **multi-module NestJS application**. Each document serves a specific purpose to help developers understand and contribute to the codebase effectively.

## 🏗️ Multi-Module Architecture

This application follows a **multi-module architecture** pattern where each feature is encapsulated in its own module:

## 📚 Documentation Structure

### For New Developers

**Start here if you're new to the project:**

1. **[Developer Guide](developer-guide.md)** - Comprehensive coding conventions, patterns, and best practices
   - Module structure and organization
   - Error handling patterns (predefined errors)
   - Controller and service conventions
   - DTO patterns and validation
   - Documentation patterns
   - Testing guidelines

2. **[Request Pipeline Guide](request-pipeline.md)** - Complete request/response pipeline
   - Middleware, pipes, interceptors, filters
   - Error handling flow
   - Response formatting
   - Security and performance considerations

### For Daily Development

1. **[Command Reference](cmd-guideline.md)** - Quick reference for common commands
   - Database migrations (generate, run, revert)
   - Data seeding
   - Code quality tools (linting, formatting, testing)
   - Git hooks and commit conventions

2. **[API Testing Guide](api-testing.md)** - Complete testing guide
   - Swagger UI usage
   - Available endpoints documentation
   - curl examples and authentication patterns
   - Testing best practices

3. **[App Configuration Guide](app-config.md)** - Configuration setup and patterns
   - Environment variables
   - Module configuration patterns
   - Type-safe configuration usage

## 🚀 Quick Start for New Developers

1. **Read the [Developer Guide](developer-guide.md)** to understand coding patterns
2. **Review [Request Pipeline](request-pipeline.md)** to understand how requests flow
3. **Check [Command Reference](cmd-guideline.md)** for common commands
4. **Reference [App Configuration](app-config.md)** when adding new config
5. **Use [API Testing](api-testing.md)** to test your endpoints

## 📋 Document Maintenance

### When to Update Documentation

- **Developer Guide**: When adding new patterns, conventions, or best practices
- **Request Pipeline**: When modifying middleware, interceptors, or error handling
- **Command Reference**: When adding new commands or common scenarios
- **API Testing**: When adding new endpoints or changing existing ones
- **App Configuration**: When adding new configuration options

### Documentation Standards

- Keep examples **realistic** and **up-to-date**
- Use **clear headings** and **consistent formatting**
- Include **code examples** for complex concepts
- Add **cross-references** between related sections
- Update **all relevant docs** when making architectural changes

## 🔍 Finding Information

| I want to... | Go to |
|---------------|--------|
| Build a new module | [Developer Guide - Module Structure](developer-guide.md#module-structure) |
| Handle errors properly | [Developer Guide - Error Handling](developer-guide.md#error-handling-patterns) |
| Write a controller | [Developer Guide - Controller Conventions](developer-guide.md#controller-conventions) |
| Create DTOs with validation | [Developer Guide - DTO Patterns](developer-guide.md#dto-patterns) |
| Understand the request flow | [Request Pipeline Guide](request-pipeline.md) |
| Test an API endpoint | [API Testing Guide](api-testing.md) |
| Add configuration | [App Configuration Guide](app-config.md) |
| Run common commands | [Command Reference](cmd-guideline.md) |

## 🎯 Best Practices

1. **Read before coding** - Understand patterns before implementing
2. **Follow conventions** - Consistency is key for maintainability
3. **Update tests** - Keep test patterns aligned with documentation
4. **Document changes** - Update relevant docs when changing architecture
5. **Ask questions** - If documentation is unclear, suggest improvements

---

**💡 Tip**: Bookmark this README and the Developer Guide for quick reference during development!