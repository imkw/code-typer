#!/bin/bash#!/bin/bash



# Quick Release Script for Code Typer# 快速发布脚本 - 创建补丁版本并推送

# Usage: ./scripts/quick-release.sh [patch|minor|major]# 使用方法: ./scripts/quick-release.sh



set -eset -e



VERSION_TYPE=${1:-patch}echo "🚀 快速发布 Code Typer 扩展..."



echo "🚀 Quick Release - Code Typer v$(node -p "require('./package.json').version")"# 检查工作区是否干净

echo "📦 Version type: $VERSION_TYPE"if [ -n "$(git status --porcelain)" ]; then

    echo "📝 提交当前更改..."

# Basic checks    git add .

if ! git diff-index --quiet HEAD --; then    git commit -m "chore: update before release"

    echo "❌ Working directory not clean. Commit changes first."fi

    exit 1

fi# 创建补丁版本

echo "📈 创建补丁版本..."

# Bump version./scripts/release.sh patch

echo "⬆️ Bumping version..."

NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version)# 自动推送

echo "✅ Version: $NEW_VERSION"echo "🔄 推送到 GitHub..."

git push && git push --tags

# Build and package

echo "🔨 Building..."echo "🎉 发布完成！"

npm run packageecho ""

npx vsce package --allow-star-activationecho "查看发布状态："

echo "https://github.com/imkw/code-typer/actions"

# Git operationsecho ""

echo "📝 Committing..."echo "发布完成后可在此处下载："

git add .echo "https://github.com/imkw/code-typer/releases"
git commit -m "chore: release $NEW_VERSION"
git tag -a "$NEW_VERSION" -m "Release $NEW_VERSION"

# Push
echo "🚀 Pushing to remote..."
git push origin main
git push origin $NEW_VERSION

echo "🎉 Release $NEW_VERSION completed!"
echo "📦 Package: code-typer-$(echo $NEW_VERSION | sed 's/v//')*.vsix"