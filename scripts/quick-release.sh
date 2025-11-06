#!/bin/bash

# 快速发布脚本 - 创建补丁版本并推送
# 使用方法: ./scripts/quick-release.sh

set -e

echo "🚀 快速发布 Code Typer 扩展..."

# 检查工作区是否干净
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 提交当前更改..."
    git add .
    git commit -m "chore: update before release"
fi

# 创建补丁版本
echo "📈 创建补丁版本..."
./scripts/release.sh patch

# 自动推送
echo "🔄 推送到 GitHub..."
git push && git push --tags

echo "🎉 发布完成！"
echo ""
echo "查看发布状态："
echo "https://github.com/imkw/code-typer/actions"
echo ""
echo "发布完成后可在此处下载："
echo "https://github.com/imkw/code-typer/releases"