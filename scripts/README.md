# Release Scripts Usage Guide

This directory contains automated scripts for releasing the Code Typer VS Code extension.

## Scripts Overview

### 1. `release.sh` - Full Release Script
**Main release script with comprehensive checks and GitHub integration**

```bash
# Patch release (1.0.0 -> 1.0.1)
./scripts/release.sh patch

# Minor release (1.0.0 -> 1.1.0)  
./scripts/release.sh minor

# Major release (1.0.0 -> 2.0.0)
./scripts/release.sh major

# Or via npm scripts
npm run release:patch
npm run release:minor  
npm run release:major
```

**What it does:**
- ✅ Runs comprehensive pre-flight checks
- ✅ Executes tests
- ✅ Bumps version in package.json
- ✅ Builds and packages extension (.vsix)
- ✅ Commits changes with descriptive message
- ✅ Creates git tag with release notes
- ✅ Pushes to remote repository
- ✅ Creates GitHub release (if `gh` CLI available)

### 2. `quick-release.sh` - Quick Release Script
**Streamlined release for rapid iterations**

```bash
# Quick patch release
./scripts/quick-release.sh

# Quick minor release
./scripts/quick-release.sh minor

# Or via npm script
npm run quick-release
```

**What it does:**
- ⚡ Basic git status check
- ⚡ Version bump
- ⚡ Build and package
- ⚡ Commit and tag
- ⚡ Push to remote

### 3. `pre-release-check.sh` - Pre-Release Validation
**Comprehensive validation before release**

```bash
# Run pre-release checks
./scripts/pre-release-check.sh

# Or via npm script
npm run pre-release-check
```

**What it checks:**
- 🔍 Git repository status and cleanliness
- 🔍 Dependencies installation
- 🔍 TypeScript compilation
- 🔍 Code linting
- 🔍 Build process
- 🔍 Required files presence
- 🔍 Internationalization files
- 🔍 Git remote configuration

## Prerequisites

### Required Tools
- **Node.js & npm** - For building and version management
- **Git** - For version control and tagging
- **VS Code Extension Manager** (`@vscode/vsce`) - For packaging

### Optional Tools
- **GitHub CLI** (`gh`) - For automatic GitHub release creation
  ```bash
  # Install GitHub CLI
  brew install gh
  # Authenticate
  gh auth login
  ```

## Typical Release Workflow

### 1. Development Complete
```bash
# Ensure all changes are committed
git status
git add .
git commit -m "feat: implement new feature"
```

### 2. Pre-Release Validation
```bash
# Run comprehensive checks
npm run pre-release-check
```

### 3. Choose Release Type

**For Bug Fixes (Patch):**
```bash
npm run release:patch
```

**For New Features (Minor):**
```bash
npm run release:minor
```

**For Breaking Changes (Major):**
```bash
npm run release:major
```

### 4. Verify Release
- Check GitHub repository for new tag and release
- Verify .vsix file is attached to GitHub release
- Test installation from .vsix file

## Version Types

| Type | Example | Use Case |
|------|---------|----------|
| `patch` | 1.0.0 → 1.0.1 | Bug fixes, documentation updates |
| `minor` | 1.0.0 → 1.1.0 | New features, enhancements |
| `major` | 1.0.0 → 2.0.0 | Breaking changes, major rewrites |

## Troubleshooting

### Common Issues

**1. Git working directory not clean**
```bash
# Check status
git status
# Commit or stash changes
git add . && git commit -m "fix: working directory cleanup"
```

**2. Tests failing**
```bash
# Run tests manually to see detailed output
npm test
```

**3. Build failure**
```bash
# Check TypeScript compilation
npm run check-types
# Check linting
npm run lint
# Try manual build
npm run package
```

**4. GitHub CLI not authenticated**
```bash
# Authenticate with GitHub
gh auth login
# Or create release manually at GitHub.com
```

**5. Permission denied on scripts**
```bash
# Add execute permission
chmod +x scripts/*.sh
```

### Manual Fallback

If scripts fail, you can perform releases manually:

```bash
# 1. Bump version
npm version patch

# 2. Build and package
npm run package
npx vsce package --allow-star-activation

# 3. Commit and tag
git add .
git commit -m "chore: release v1.0.1"
git tag -a "v1.0.1" -m "Release v1.0.1"

# 4. Push
git push origin main
git push origin v1.0.1

# 5. Create GitHub release manually at:
# https://github.com/imkw/code-typer/releases/new
```

## Script Customization

### Modifying Release Messages
Edit the commit message template in `release.sh`:
```bash
git commit -m "chore: release v$version

- Your custom message here
- Additional notes"
```

### Changing GitHub Release Notes
Edit the release notes template in the `create_github_release()` function in `release.sh`.

### Adding Custom Checks
Add additional validation steps in `pre-release-check.sh` before the summary section.

## Best Practices

1. **Always run pre-release checks** before releasing
2. **Use semantic versioning** appropriately
3. **Test the .vsix file** after packaging
4. **Keep CHANGELOG.md updated** before releases
5. **Use descriptive commit messages** for release commits
6. **Tag releases consistently** with `v` prefix (e.g., `v1.0.1`)
7. **Verify GitHub releases** have correct assets attached

---

For more information about the Code Typer extension, see the main [README.md](../README.md).