#!/bin/bash#!/bin/bash#!/bin/bash



# Code Typer Extension Release Script

# This script automates the release process: version bump, build, package, git commit, tag, and push

# Code Typer Extension Release Script# 版本发布脚本

set -e  # Exit on any error

# This script automates the release process: version bump, build, package, git commit, tag, and push# 使用方法: ./scripts/release.sh [major|minor|patch]

# Colors for output

RED='\033[0;31m'

GREEN='\033[0;32m'

YELLOW='\033[1;33m'

BLUE='\033[0;34m'

NC='\033[0m' # No Color



# Function to print colored output# Colors for output# 检查参数

print_status() {

    echo -e "${BLUE}[INFO]${NC} $1"RED='\033[0;31m'if [ $# -eq 0 ]; then

}

GREEN='\033[0;32m'    echo "使用方法: $0 [major|minor|patch]"

print_success() {

    echo -e "${GREEN}[SUCCESS]${NC} $1"YELLOW='\033[1;33m'    echo "  major: 主版本号 (1.0.0 -> 2.0.0)"

}

BLUE='\033[0;34m'    echo "  minor: 次版本号 (1.0.0 -> 1.1.0)"

print_warning() {

    echo -e "${YELLOW}[WARNING]${NC} $1"NC='\033[0m' # No Color    echo "  patch: 补丁版本号 (1.0.0 -> 1.0.1)"

}

    exit 1

print_error() {

    echo -e "${RED}[ERROR]${NC} $1"# Function to print colored outputfi

}

print_status() {

# Function to check if we're in a git repository

check_git_repo() {    echo -e "${BLUE}[INFO]${NC} $1"VERSION_TYPE=$1

    if ! git rev-parse --git-dir > /dev/null 2>&1; then

        print_error "Not in a git repository!"}

        exit 1

    fi# 检查是否在 git 仓库中

}

print_success() {if ! git rev-parse --git-dir > /dev/null 2>&1; then

# Function to check if working directory is clean

check_working_directory() {    echo -e "${GREEN}[SUCCESS]${NC} $1"    echo "错误: 当前目录不是 git 仓库"

    if ! git diff-index --quiet HEAD --; then

        print_error "Working directory is not clean. Please commit or stash changes first."}    exit 1

        git status --porcelain

        exit 1fi

    fi

}print_warning() {



# Function to check if we're on main branch    echo -e "${YELLOW}[WARNING]${NC} $1"# 检查工作区是否干净

check_main_branch() {

    local current_branch=$(git rev-parse --abbrev-ref HEAD)}if [ -n "$(git status --porcelain)" ]; then

    if [ "$current_branch" != "main" ]; then

        print_warning "Not on main branch (current: $current_branch)"    echo "错误: 工作区有未提交的更改，请先提交或丢弃更改"

        read -p "Continue anyway? (y/N): " -n 1 -r

        echoprint_error() {    git status --short

        if [[ ! $REPLY =~ ^[Yy]$ ]]; then

            print_error "Aborted by user"    echo -e "${RED}[ERROR]${NC} $1"    exit 1

            exit 1

        fi}fi

    fi

}



# Function to validate version type# Function to check if we're in a git repositoryecho "🔍 检查项目状态..."

validate_version_type() {

    local version_type=$1check_git_repo() {

    if [[ ! "$version_type" =~ ^(patch|minor|major)$ ]]; then

        print_error "Invalid version type: $version_type"    if ! git rev-parse --git-dir > /dev/null 2>&1; then# 安装依赖

        print_error "Valid types: patch, minor, major"

        exit 1        print_error "Not in a git repository!"npm ci

    fi

}        exit 1



# Function to get current version    fi# 编译项目

get_current_version() {

    node -p "require('./package.json').version"}echo "🔨 编译项目..."

}

npm run compile

# Function to bump version and get new version

bump_version() {# Function to check if working directory is clean

    local version_type=$1

    print_status "Bumping $version_type version..."check_working_directory() {# 更新版本号

    

    # Use npm version to bump version    if ! git diff-index --quiet HEAD --; thenecho "📝 更新版本号..."

    npm version $version_type --no-git-tag-version

            print_error "Working directory is not clean. Please commit or stash changes first."OLD_VERSION=$(node -p "require('./package.json').version")

    # Get the new version

    get_current_version        git status --porcelainnpm version $VERSION_TYPE --no-git-tag-version

}

        exit 1NEW_VERSION=$(node -p "require('./package.json').version")

# Function to run tests

run_tests() {    fi

    print_status "Running tests..."

    npm test || {}echo "版本从 $OLD_VERSION 更新到 $NEW_VERSION"

        print_error "Tests failed!"

        exit 1

    }

    print_success "Tests passed!"# Function to check if we're on main branch# 更新 CHANGELOG.md

}

check_main_branch() {echo "📋 更新 CHANGELOG.md..."

# Function to build and package

build_and_package() {    local current_branch=$(git rev-parse --abbrev-ref HEAD)if [ ! -f CHANGELOG.md ]; then

    print_status "Building and packaging extension..."

        if [ "$current_branch" != "main" ]; then    cat > CHANGELOG.md << EOF

    # Clean previous builds

    rm -rf dist out *.vsix        print_warning "Not on main branch (current: $current_branch)"# Changelog

    

    # Build        read -p "Continue anyway? (y/N): " -n 1 -r

    npm run package || {

        print_error "Build failed!"        echoAll notable changes to this project will be documented in this file.

        exit 1

    }        if [[ ! $REPLY =~ ^[Yy]$ ]]; then

    

    # Package extension            print_error "Aborted by user"## [$NEW_VERSION] - $(date +%Y-%m-%d)

    npx vsce package --allow-star-activation || {

        print_error "Packaging failed!"            exit 1

        exit 1

    }        fi### Added

    

    print_success "Build and packaging completed!"    fi- Version bump to $NEW_VERSION

}

}

# Function to commit and tag

commit_and_tag() {EOF

    local version=$1

    local version_type=$2# Function to validate version typeelse

    

    print_status "Committing changes and creating tag..."validate_version_type() {    # 在现有 CHANGELOG.md 中添加新版本

    

    # Add all changes    local version_type=$1    sed -i.bak "5i\\

    git add .

        if [[ ! "$version_type" =~ ^(patch|minor|major)$ ]]; then\\

    # Commit

    git commit -m "chore: release v$version        print_error "Invalid version type: $version_type"## [$NEW_VERSION] - $(date +%Y-%m-%d)\\



- Bump version to $version ($version_type)        print_error "Valid types: patch, minor, major"\\

- Update package and build artifacts

- Automated release via release script" || {        exit 1### Changed\\

        print_error "Commit failed!"

        exit 1    fi- Version bump to $NEW_VERSION\\

    }

    }" CHANGELOG.md

    # Create tag

    git tag -a "v$version" -m "Release v$version    rm CHANGELOG.md.bak 2>/dev/null || true



🚀 Code Typer v$version# Function to get current versionfi



## What's Newget_current_version() {

- Multi-language support (English, 简体中文, 繁體中文, 日本語, 한국어)

- Improved user interface with automatic language detection    node -p "require('./package.json').version"# 提交更改

- Enhanced template system

- Better status bar controls}echo "💾 提交版本更改..."



## Installationgit add package.json CHANGELOG.md

Download the .vsix file from releases and install via VS Code.

# Function to bump version and get new versiongit commit -m "chore: bump version to $NEW_VERSION"

## Full Changelog

See CHANGELOG.md for detailed changes.bump_version() {

" || {

        print_error "Tagging failed!"    local version_type=$1# 创建标签

        exit 1

    }    print_status "Bumping $version_type version..."echo "🏷️  创建标签..."

    

    print_success "Committed and tagged v$version"    git tag -a "v$NEW_VERSION" -m "Release version $NEW_VERSION"

}

    # Use npm version to bump version

# Function to push to remote

push_to_remote() {    npm version $version_type --no-git-tag-versionecho "✅ 版本 $NEW_VERSION 准备就绪!"

    local version=$1

        echo ""

    print_status "Pushing to remote repository..."

        # Get the new versionecho "下一步操作:"

    # Push commits

    git push origin || {    get_current_versionecho "1. 推送提交: git push"

        print_error "Failed to push commits!"

        exit 1}echo "2. 推送标签: git push --tags"

    }

    echo ""

    # Push tags

    git push origin "v$version" || {# Function to run testsecho "推送标签后，GitHub Actions 将自动:"

        print_error "Failed to push tag!"

        exit 1run_tests() {echo "- 编译扩展"

    }

        print_status "Running tests..."echo "- 创建 GitHub Release"

    print_success "Pushed to remote repository!"

}    npm test || {echo "- 上传 .vsix 文件"



# Function to create GitHub release (optional)        print_error "Tests failed!"echo ""

create_github_release() {

    local version=$1        exit 1echo "执行推送命令："

    

    print_status "Creating GitHub release..."    }echo "git push && git push --tags"

        print_success "Tests passed!"

    # Check if gh CLI is available}

    if ! command -v gh &> /dev/null; then

        print_warning "GitHub CLI (gh) not found. Skipping automatic release creation."# Function to build and package

        print_warning "You can manually create a release at: https://github.com/imkw/code-typer/releases/new"build_and_package() {

        return    print_status "Building and packaging extension..."

    fi    

        # Clean previous builds

    # Check if authenticated    rm -rf dist out *.vsix

    if ! gh auth status &> /dev/null; then    

        print_warning "Not authenticated with GitHub CLI. Skipping automatic release creation."    # Build

        print_warning "Run 'gh auth login' to authenticate, then create release manually."    npm run package || {

        return        print_error "Build failed!"

    fi        exit 1

        }

    # Find the .vsix file    

    local vsix_file=$(ls code-typer-*.vsix | head -1)    # Package extension

    if [ -z "$vsix_file" ]; then    npx vsce package --allow-star-activation || {

        print_warning "No .vsix file found. Skipping asset upload."        print_error "Packaging failed!"

        return        exit 1

    fi    }

        

    # Create release    print_success "Build and packaging completed!"

    gh release create "v$version" \}

        --title "Code Typer v$version" \

        --notes "🚀 **Code Typer v$version**# Function to commit and tag

commit_and_tag() {

## 🌍 Multi-Language Support    local version=$1

This release includes full internationalization with support for:    local version_type=$2

- **English** (Default)    

- **简体中文** (Simplified Chinese)     print_status "Committing changes and creating tag..."

- **繁體中文** (Traditional Chinese)    

- **日本語** (Japanese)    # Add all changes

- **한국어** (Korean)    git add .

    

## ✨ Key Features    # Commit

- 🚀 Multiple typing speeds (Slow, Normal, Fast)    git commit -m "chore: release v$version

- ⌨️ Realistic typing simulation with random delays

- 🎯 Smart character recognition for different typing speeds- Bump version to $version ($version_type)

- 📁 Template system with .vscode/codetyper/ directory support- Update package and build artifacts

- 🎮 Status bar controls for play, pause, stop functionality- Automated release via release script" || {

- 📊 Progress display with cancellation support        print_error "Commit failed!"

        exit 1

## 📦 Installation    }

1. Download the \`code-typer-$version.vsix\` file below    

2. In VS Code, press \`Ctrl+Shift+P\` (\`Cmd+Shift+P\` on Mac)    # Create tag

3. Type \"Extensions: Install from VSIX...\"    git tag -a "v$version" -m "Release v$version

4. Select the downloaded file

🚀 Code Typer v$version

## 🔧 Usage

- Press \`Ctrl+Shift+T\` (\`Cmd+Shift+T\` on Mac) to start typing## What's New

- Use Command Palette: \"Type Code\" commands- Multi-language support (English, 简体中文, 繁體中文, 日本語, 한국어)

- Right-click context menu: \"Type Code\"- Improved user interface with automatic language detection

- Status bar controls for advanced functionality- Enhanced template system

- Better status bar controls

See [README.md](https://github.com/imkw/code-typer#readme) for detailed usage instructions.

## Installation

---Download the .vsix file from releases and install via VS Code.

**Full Changelog**: [CHANGELOG.md](https://github.com/imkw/code-typer/blob/v$version/CHANGELOG.md)" \

        "$vsix_file" || {## Full Changelog

        print_warning "Failed to create GitHub release automatically."See CHANGELOG.md for detailed changes.

        print_warning "Please create the release manually at: https://github.com/imkw/code-typer/releases/new"" || {

        return        print_error "Tagging failed!"

    }        exit 1

        }

    print_success "GitHub release created successfully!"    

    print_success "Release URL: https://github.com/imkw/code-typer/releases/tag/v$version"    print_success "Committed and tagged v$version"

}}



# Main function# Function to push to remote

main() {push_to_remote() {

    local version_type=${1:-patch}    local version=$1

        

    print_status "🚀 Starting Code Typer release process..."    print_status "Pushing to remote repository..."

    print_status "Version type: $version_type"    

        # Push commits

    # Validate inputs    git push origin || {

    validate_version_type $version_type        print_error "Failed to push commits!"

            exit 1

    # Pre-flight checks    }

    check_git_repo    

    check_working_directory    # Push tags

    check_main_branch    git push origin "v$version" || {

            print_error "Failed to push tag!"

    # Get current version        exit 1

    local old_version=$(get_current_version)    }

    print_status "Current version: $old_version"    

        print_success "Pushed to remote repository!"

    # Confirm release}

    echo

    print_warning "This will:"# Function to create GitHub release (optional)

    echo "  1. Run tests"create_github_release() {

    echo "  2. Bump $version_type version"    local version=$1

    echo "  3. Build and package extension"    

    echo "  4. Commit changes"    print_status "Creating GitHub release..."

    echo "  5. Create git tag"    

    echo "  6. Push to remote repository"    # Check if gh CLI is available

    echo "  7. Create GitHub release (if gh CLI available)"    if ! command -v gh &> /dev/null; then

    echo        print_warning "GitHub CLI (gh) not found. Skipping automatic release creation."

    read -p "Continue with release? (y/N): " -n 1 -r        print_warning "You can manually create a release at: https://github.com/imkw/code-typer/releases/new"

    echo        return

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then    fi

        print_error "Release aborted by user"    

        exit 1    # Check if authenticated

    fi    if ! gh auth status &> /dev/null; then

            print_warning "Not authenticated with GitHub CLI. Skipping automatic release creation."

    # Run tests first        print_warning "Run 'gh auth login' to authenticate, then create release manually."

    run_tests        return

        fi

    # Bump version    

    local new_version=$(bump_version $version_type)    # Find the .vsix file

    print_success "Version bumped from $old_version to $new_version"    local vsix_file=$(ls code-typer-*.vsix | head -1)

        if [ -z "$vsix_file" ]; then

    # Build and package        print_warning "No .vsix file found. Skipping asset upload."

    build_and_package        return

        fi

    # Commit and tag    

    commit_and_tag $new_version $version_type    # Create release

        gh release create "v$version" \

    # Push to remote        --title "Code Typer v$version" \

    push_to_remote $new_version        --notes "🚀 **Code Typer v$version**

    

    # Create GitHub release## 🌍 Multi-Language Support

    create_github_release $new_versionThis release includes full internationalization with support for:

    - **English** (Default)

    print_success "🎉 Release v$new_version completed successfully!"- **简体中文** (Simplified Chinese) 

    print_success "Extension package: code-typer-$new_version.vsix"- **繁體中文** (Traditional Chinese)

    print_success "Git tag: v$new_version"- **日本語** (Japanese)

    print_success "Repository: https://github.com/imkw/code-typer"- **한국어** (Korean)

}

## ✨ Key Features

# Help function- 🚀 Multiple typing speeds (Slow, Normal, Fast)

show_help() {- ⌨️ Realistic typing simulation with random delays

    echo "Code Typer Release Script"- 🎯 Smart character recognition for different typing speeds

    echo- 📁 Template system with .vscode/codetyper/ directory support

    echo "Usage: $0 [VERSION_TYPE]"- 🎮 Status bar controls for play, pause, stop functionality

    echo- 📊 Progress display with cancellation support

    echo "VERSION_TYPE:"

    echo "  patch   - Increment patch version (1.0.0 -> 1.0.1) [default]"## 📦 Installation

    echo "  minor   - Increment minor version (1.0.0 -> 1.1.0)"1. Download the \`code-typer-$version.vsix\` file below

    echo "  major   - Increment major version (1.0.0 -> 2.0.0)"2. In VS Code, press \`Ctrl+Shift+P\` (\`Cmd+Shift+P\` on Mac)

    echo3. Type \"Extensions: Install from VSIX...\"

    echo "Examples:"4. Select the downloaded file

    echo "  $0           # Patch release"

    echo "  $0 patch     # Patch release"## 🔧 Usage

    echo "  $0 minor     # Minor release"- Press \`Ctrl+Shift+T\` (\`Cmd+Shift+T\` on Mac) to start typing

    echo "  $0 major     # Major release"- Use Command Palette: \"Type Code\" commands

    echo- Right-click context menu: \"Type Code\"

    echo "This script will:"- Status bar controls for advanced functionality

    echo "  1. Run tests"

    echo "  2. Bump version in package.json"See [README.md](https://github.com/imkw/code-typer#readme) for detailed usage instructions.

    echo "  3. Build and package the extension"

    echo "  4. Commit changes and create git tag"---

    echo "  5. Push to remote repository"**Full Changelog**: [CHANGELOG.md](https://github.com/imkw/code-typer/blob/v$version/CHANGELOG.md)" \

    echo "  6. Create GitHub release (if authenticated)"        "$vsix_file" || {

}        print_warning "Failed to create GitHub release automatically."

        print_warning "Please create the release manually at: https://github.com/imkw/code-typer/releases/new"

# Check for help flag        return

if [[ "$1" == "-h" || "$1" == "--help" ]]; then    }

    show_help    

    exit 0    print_success "GitHub release created successfully!"

fi    print_success "Release URL: https://github.com/imkw/code-typer/releases/tag/v$version"

}

# Run main function

main "$@"# Main function
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