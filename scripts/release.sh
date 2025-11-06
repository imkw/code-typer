#!/bin/bash

# 版本发布脚本
# 使用方法: ./scripts/release.sh [major|minor|patch]

set -e

# 检查参数
if [ $# -eq 0 ]; then
    echo "使用方法: $0 [major|minor|patch]"
    echo "  major: 主版本号 (1.0.0 -> 2.0.0)"
    echo "  minor: 次版本号 (1.0.0 -> 1.1.0)"
    echo "  patch: 补丁版本号 (1.0.0 -> 1.0.1)"
    exit 1
fi

VERSION_TYPE=$1

# 检查是否在 git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "错误: 当前目录不是 git 仓库"
    exit 1
fi

# 检查工作区是否干净
if [ -n "$(git status --porcelain)" ]; then
    echo "错误: 工作区有未提交的更改，请先提交或丢弃更改"
    git status --short
    exit 1
fi

echo "🔍 检查项目状态..."

# 安装依赖
npm ci

# 编译项目
echo "🔨 编译项目..."
npm run compile

# 更新版本号
echo "📝 更新版本号..."
OLD_VERSION=$(node -p "require('./package.json').version")
npm version $VERSION_TYPE --no-git-tag-version
NEW_VERSION=$(node -p "require('./package.json').version")

echo "版本从 $OLD_VERSION 更新到 $NEW_VERSION"

# 更新 CHANGELOG.md
echo "📋 更新 CHANGELOG.md..."
if [ ! -f CHANGELOG.md ]; then
    cat > CHANGELOG.md << EOF
# Changelog

All notable changes to this project will be documented in this file.

## [$NEW_VERSION] - $(date +%Y-%m-%d)

### Added
- Version bump to $NEW_VERSION

EOF
else
    # 在现有 CHANGELOG.md 中添加新版本
    sed -i.bak "5i\\
\\
## [$NEW_VERSION] - $(date +%Y-%m-%d)\\
\\
### Changed\\
- Version bump to $NEW_VERSION\\
" CHANGELOG.md
    rm CHANGELOG.md.bak 2>/dev/null || true
fi

# 提交更改
echo "💾 提交版本更改..."
git add package.json CHANGELOG.md
git commit -m "chore: bump version to $NEW_VERSION"

# 创建标签
echo "🏷️  创建标签..."
git tag -a "v$NEW_VERSION" -m "Release version $NEW_VERSION"

echo "✅ 版本 $NEW_VERSION 准备就绪!"
echo ""
echo "下一步操作:"
echo "1. 推送提交: git push"
echo "2. 推送标签: git push --tags"
echo ""
echo "推送标签后，GitHub Actions 将自动:"
echo "- 编译扩展"
echo "- 创建 GitHub Release"
echo "- 上传 .vsix 文件"
echo ""
echo "执行推送命令："
echo "git push && git push --tags"