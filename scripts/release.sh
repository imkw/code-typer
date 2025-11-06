#!/bin/bash#!/bin/bash



# Code Typer Extension Release Script# 版本发布脚本

# This script automates the release process: version bump, build, package, git commit, tag, and push# 使用方法: ./scripts/release.sh [major|minor|patch]



set -e  # Exit on any errorset -e



# Colors for output# 检查参数

RED='\033[0;31m'if [ $# -eq 0 ]; then

GREEN='\033[0;32m'    echo "使用方法: $0 [major|minor|patch]"

YELLOW='\033[1;33m'    echo "  major: 主版本号 (1.0.0 -> 2.0.0)"

BLUE='\033[0;34m'    echo "  minor: 次版本号 (1.0.0 -> 1.1.0)"

NC='\033[0m' # No Color    echo "  patch: 补丁版本号 (1.0.0 -> 1.0.1)"

    exit 1

# Function to print colored outputfi

print_status() {

    echo -e "${BLUE}[INFO]${NC} $1"VERSION_TYPE=$1

}

# 检查是否在 git 仓库中

print_success() {if ! git rev-parse --git-dir > /dev/null 2>&1; then

    echo -e "${GREEN}[SUCCESS]${NC} $1"    echo "错误: 当前目录不是 git 仓库"

}    exit 1

fi

print_warning() {

    echo -e "${YELLOW}[WARNING]${NC} $1"# 检查工作区是否干净

}if [ -n "$(git status --porcelain)" ]; then

    echo "错误: 工作区有未提交的更改，请先提交或丢弃更改"

print_error() {    git status --short

    echo -e "${RED}[ERROR]${NC} $1"    exit 1

}fi



# Function to check if we're in a git repositoryecho "🔍 检查项目状态..."

check_git_repo() {

    if ! git rev-parse --git-dir > /dev/null 2>&1; then# 安装依赖

        print_error "Not in a git repository!"npm ci

        exit 1

    fi# 编译项目

}echo "🔨 编译项目..."

npm run compile

# Function to check if working directory is clean

check_working_directory() {# 更新版本号

    if ! git diff-index --quiet HEAD --; thenecho "📝 更新版本号..."

        print_error "Working directory is not clean. Please commit or stash changes first."OLD_VERSION=$(node -p "require('./package.json').version")

        git status --porcelainnpm version $VERSION_TYPE --no-git-tag-version

        exit 1NEW_VERSION=$(node -p "require('./package.json').version")

    fi

}echo "版本从 $OLD_VERSION 更新到 $NEW_VERSION"



# Function to check if we're on main branch# 更新 CHANGELOG.md

check_main_branch() {echo "📋 更新 CHANGELOG.md..."

    local current_branch=$(git rev-parse --abbrev-ref HEAD)if [ ! -f CHANGELOG.md ]; then

    if [ "$current_branch" != "main" ]; then    cat > CHANGELOG.md << EOF

        print_warning "Not on main branch (current: $current_branch)"# Changelog

        read -p "Continue anyway? (y/N): " -n 1 -r

        echoAll notable changes to this project will be documented in this file.

        if [[ ! $REPLY =~ ^[Yy]$ ]]; then

            print_error "Aborted by user"## [$NEW_VERSION] - $(date +%Y-%m-%d)

            exit 1

        fi### Added

    fi- Version bump to $NEW_VERSION

}

EOF

# Function to validate version typeelse

validate_version_type() {    # 在现有 CHANGELOG.md 中添加新版本

    local version_type=$1    sed -i.bak "5i\\

    if [[ ! "$version_type" =~ ^(patch|minor|major)$ ]]; then\\

        print_error "Invalid version type: $version_type"## [$NEW_VERSION] - $(date +%Y-%m-%d)\\

        print_error "Valid types: patch, minor, major"\\

        exit 1### Changed\\

    fi- Version bump to $NEW_VERSION\\

}" CHANGELOG.md

    rm CHANGELOG.md.bak 2>/dev/null || true

# Function to get current versionfi

get_current_version() {

    node -p "require('./package.json').version"# 提交更改

}echo "💾 提交版本更改..."

git add package.json CHANGELOG.md

# Function to bump version and get new versiongit commit -m "chore: bump version to $NEW_VERSION"

bump_version() {

    local version_type=$1# 创建标签

    print_status "Bumping $version_type version..."echo "🏷️  创建标签..."

    git tag -a "v$NEW_VERSION" -m "Release version $NEW_VERSION"

    # Use npm version to bump version

    npm version $version_type --no-git-tag-versionecho "✅ 版本 $NEW_VERSION 准备就绪!"

    echo ""

    # Get the new versionecho "下一步操作:"

    get_current_versionecho "1. 推送提交: git push"

}echo "2. 推送标签: git push --tags"

echo ""

# Function to run testsecho "推送标签后，GitHub Actions 将自动:"

run_tests() {echo "- 编译扩展"

    print_status "Running tests..."echo "- 创建 GitHub Release"

    npm test || {echo "- 上传 .vsix 文件"

        print_error "Tests failed!"echo ""

        exit 1echo "执行推送命令："

    }echo "git push && git push --tags"
    print_success "Tests passed!"
}

# Function to build and package
build_and_package() {
    print_status "Building and packaging extension..."
    
    # Clean previous builds
    rm -rf dist out *.vsix
    
    # Build
    npm run package || {
        print_error "Build failed!"
        exit 1
    }
    
    # Package extension
    npx vsce package --allow-star-activation || {
        print_error "Packaging failed!"
        exit 1
    }
    
    print_success "Build and packaging completed!"
}

# Function to commit and tag
commit_and_tag() {
    local version=$1
    local version_type=$2
    
    print_status "Committing changes and creating tag..."
    
    # Add all changes
    git add .
    
    # Commit
    git commit -m "chore: release v$version

- Bump version to $version ($version_type)
- Update package and build artifacts
- Automated release via release script" || {
        print_error "Commit failed!"
        exit 1
    }
    
    # Create tag
    git tag -a "v$version" -m "Release v$version

🚀 Code Typer v$version

## What's New
- Multi-language support (English, 简体中文, 繁體中文, 日本語, 한국어)
- Improved user interface with automatic language detection
- Enhanced template system
- Better status bar controls

## Installation
Download the .vsix file from releases and install via VS Code.

## Full Changelog
See CHANGELOG.md for detailed changes.
" || {
        print_error "Tagging failed!"
        exit 1
    }
    
    print_success "Committed and tagged v$version"
}

# Function to push to remote
push_to_remote() {
    local version=$1
    
    print_status "Pushing to remote repository..."
    
    # Push commits
    git push origin || {
        print_error "Failed to push commits!"
        exit 1
    }
    
    # Push tags
    git push origin "v$version" || {
        print_error "Failed to push tag!"
        exit 1
    }
    
    print_success "Pushed to remote repository!"
}

# Function to create GitHub release (optional)
create_github_release() {
    local version=$1
    
    print_status "Creating GitHub release..."
    
    # Check if gh CLI is available
    if ! command -v gh &> /dev/null; then
        print_warning "GitHub CLI (gh) not found. Skipping automatic release creation."
        print_warning "You can manually create a release at: https://github.com/imkw/code-typer/releases/new"
        return
    fi
    
    # Check if authenticated
    if ! gh auth status &> /dev/null; then
        print_warning "Not authenticated with GitHub CLI. Skipping automatic release creation."
        print_warning "Run 'gh auth login' to authenticate, then create release manually."
        return
    fi
    
    # Find the .vsix file
    local vsix_file=$(ls code-typer-*.vsix | head -1)
    if [ -z "$vsix_file" ]; then
        print_warning "No .vsix file found. Skipping asset upload."
        return
    fi
    
    # Create release
    gh release create "v$version" \
        --title "Code Typer v$version" \
        --notes "🚀 **Code Typer v$version**

## 🌍 Multi-Language Support
This release includes full internationalization with support for:
- **English** (Default)
- **简体中文** (Simplified Chinese) 
- **繁體中文** (Traditional Chinese)
- **日本語** (Japanese)
- **한국어** (Korean)

## ✨ Key Features
- 🚀 Multiple typing speeds (Slow, Normal, Fast)
- ⌨️ Realistic typing simulation with random delays
- 🎯 Smart character recognition for different typing speeds
- 📁 Template system with .vscode/codetyper/ directory support
- 🎮 Status bar controls for play, pause, stop functionality
- 📊 Progress display with cancellation support

## 📦 Installation
1. Download the \`code-typer-$version.vsix\` file below
2. In VS Code, press \`Ctrl+Shift+P\` (\`Cmd+Shift+P\` on Mac)
3. Type \"Extensions: Install from VSIX...\"
4. Select the downloaded file

## 🔧 Usage
- Press \`Ctrl+Shift+T\` (\`Cmd+Shift+T\` on Mac) to start typing
- Use Command Palette: \"Type Code\" commands
- Right-click context menu: \"Type Code\"
- Status bar controls for advanced functionality

See [README.md](https://github.com/imkw/code-typer#readme) for detailed usage instructions.

---
**Full Changelog**: [CHANGELOG.md](https://github.com/imkw/code-typer/blob/v$version/CHANGELOG.md)" \
        "$vsix_file" || {
        print_warning "Failed to create GitHub release automatically."
        print_warning "Please create the release manually at: https://github.com/imkw/code-typer/releases/new"
        return
    }
    
    print_success "GitHub release created successfully!"
    print_success "Release URL: https://github.com/imkw/code-typer/releases/tag/v$version"
}

# Main function
main() {
    local version_type=${1:-patch}
    
    print_status "🚀 Starting Code Typer release process..."
    print_status "Version type: $version_type"
    
    # Validate inputs
    validate_version_type $version_type
    
    # Pre-flight checks
    check_git_repo
    check_working_directory
    check_main_branch
    
    # Get current version
    local old_version=$(get_current_version)
    print_status "Current version: $old_version"
    
    # Confirm release
    echo
    print_warning "This will:"
    echo "  1. Run tests"
    echo "  2. Bump $version_type version"
    echo "  3. Build and package extension"
    echo "  4. Commit changes"
    echo "  5. Create git tag"
    echo "  6. Push to remote repository"
    echo "  7. Create GitHub release (if gh CLI available)"
    echo
    read -p "Continue with release? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Release aborted by user"
        exit 1
    fi
    
    # Run tests first
    run_tests
    
    # Bump version
    local new_version=$(bump_version $version_type)
    print_success "Version bumped from $old_version to $new_version"
    
    # Build and package
    build_and_package
    
    # Commit and tag
    commit_and_tag $new_version $version_type
    
    # Push to remote
    push_to_remote $new_version
    
    # Create GitHub release
    create_github_release $new_version
    
    print_success "🎉 Release v$new_version completed successfully!"
    print_success "Extension package: code-typer-$new_version.vsix"
    print_success "Git tag: v$new_version"
    print_success "Repository: https://github.com/imkw/code-typer"
}

# Help function
show_help() {
    echo "Code Typer Release Script"
    echo
    echo "Usage: $0 [VERSION_TYPE]"
    echo
    echo "VERSION_TYPE:"
    echo "  patch   - Increment patch version (1.0.0 -> 1.0.1) [default]"
    echo "  minor   - Increment minor version (1.0.0 -> 1.1.0)"
    echo "  major   - Increment major version (1.0.0 -> 2.0.0)"
    echo
    echo "Examples:"
    echo "  $0           # Patch release"
    echo "  $0 patch     # Patch release"
    echo "  $0 minor     # Minor release"
    echo "  $0 major     # Major release"
    echo
    echo "This script will:"
    echo "  1. Run tests"
    echo "  2. Bump version in package.json"
    echo "  3. Build and package the extension"
    echo "  4. Commit changes and create git tag"
    echo "  5. Push to remote repository"
    echo "  6. Create GitHub release (if authenticated)"
}

# Check for help flag
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    show_help
    exit 0
fi

# Run main function
main "$@"