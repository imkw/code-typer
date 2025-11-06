#!/bin/bash

# Pre-release Check Script for Code Typer
# This script performs all necessary checks before release

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Pre-release checks for Code Typer${NC}"
echo "========================================"

# Check 1: Git repository status
echo -e "\n${BLUE}1. Checking git repository...${NC}"
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not in a git repository${NC}"
    exit 1
fi

if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ Working directory is not clean${NC}"
    echo "Uncommitted changes:"
    git status --porcelain
    exit 1
fi

current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "main" ]; then
    echo -e "${YELLOW}⚠️ Not on main branch (current: $current_branch)${NC}"
else
    echo -e "${GREEN}✅ On main branch${NC}"
fi

echo -e "${GREEN}✅ Git repository is clean${NC}"

# Check 2: Dependencies
echo -e "\n${BLUE}2. Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${RED}❌ node_modules not found. Run 'npm install'${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Check 3: TypeScript compilation
echo -e "\n${BLUE}3. Checking TypeScript compilation...${NC}"
if ! npm run check-types > /dev/null 2>&1; then
    echo -e "${RED}❌ TypeScript compilation failed${NC}"
    npm run check-types
    exit 1
fi
echo -e "${GREEN}✅ TypeScript compilation successful${NC}"

# Check 4: Linting
echo -e "\n${BLUE}4. Checking code linting...${NC}"
if ! npm run lint > /dev/null 2>&1; then
    echo -e "${RED}❌ Linting failed${NC}"
    npm run lint
    exit 1
fi
echo -e "${GREEN}✅ Code linting passed${NC}"

# Check 5: Build test
echo -e "\n${BLUE}5. Testing build process...${NC}"
if ! npm run package > /dev/null 2>&1; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build successful${NC}"

# Check 6: Package info
echo -e "\n${BLUE}6. Package information...${NC}"
CURRENT_VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME=$(node -p "require('./package.json').name")
echo -e "Package: ${GREEN}$PACKAGE_NAME${NC}"
echo -e "Current version: ${GREEN}v$CURRENT_VERSION${NC}"

# Check 7: Files check
echo -e "\n${BLUE}7. Checking required files...${NC}"
required_files=("package.json" "README.md" "CHANGELOG.md" "LICENSE" "src/extension.ts")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Missing required file: $file${NC}"
        exit 1
    fi
done
echo -e "${GREEN}✅ All required files present${NC}"

# Check 8: i18n files
echo -e "\n${BLUE}8. Checking internationalization files...${NC}"
i18n_files=("package.nls.json" "package.nls.zh-cn.json" "package.nls.zh-tw.json" "package.nls.ja.json" "package.nls.ko.json")
for file in "${i18n_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Missing i18n file: $file${NC}"
        exit 1
    fi
done
echo -e "${GREEN}✅ All i18n files present${NC}"

# Check 9: Git remote
echo -e "\n${BLUE}9. Checking git remote...${NC}"
if ! git remote get-url origin > /dev/null 2>&1; then
    echo -e "${RED}❌ No git remote 'origin' configured${NC}"
    exit 1
fi
remote_url=$(git remote get-url origin)
echo -e "Remote URL: ${GREEN}$remote_url${NC}"

# Summary
echo -e "\n${GREEN}🎉 All pre-release checks passed!${NC}"
echo "========================================"
echo -e "${BLUE}Ready for release:${NC}"
echo -e "  Package: $PACKAGE_NAME"
echo -e "  Current version: v$CURRENT_VERSION"
echo -e "  Next patch version: v$(npm version patch --dry-run | sed 's/v//')"
echo -e "  Next minor version: v$(npm version minor --dry-run | sed 's/v//')"
echo -e "  Next major version: v$(npm version major --dry-run | sed 's/v//')"
echo ""
echo -e "${BLUE}To release:${NC}"
echo -e "  ./scripts/release.sh patch    # For bug fixes"
echo -e "  ./scripts/release.sh minor    # For new features"
echo -e "  ./scripts/release.sh major    # For breaking changes"
echo ""
echo -e "${BLUE}Quick release:${NC}"
echo -e "  ./scripts/quick-release.sh    # Patch release"