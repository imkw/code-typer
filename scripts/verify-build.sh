#!/bin/bash

# 构建验证脚本
# 验证扩展是否可以正确构建和打包

set -e

echo "🔍 验证 Code Typer 扩展构建..."

# 检查 Node.js 版本
echo "📋 Node.js 版本: $(node --version)"
echo "📋 npm 版本: $(npm --version)"

# 清理之前的构建
echo "🧹 清理之前的构建..."
rm -rf dist/
rm -f *.vsix

# 安装依赖
echo "📦 安装依赖..."
npm ci

# 类型检查
echo "🔍 类型检查..."
npm run check-types

# 代码检查
echo "🔍 代码检查..."
npm run lint

# 编译
echo "🔨 编译扩展..."
npm run compile

# 验证输出文件
if [ ! -f "dist/extension.js" ]; then
    echo "❌ 编译失败: dist/extension.js 文件不存在"
    exit 1
fi

echo "✅ 编译成功!"

# 安装 vsce（如果没有安装）
if ! command -v vsce &> /dev/null; then
    echo "📦 安装 vsce..."
    npm install -g @vscode/vsce
fi

# 打包扩展
echo "📦 打包扩展..."
vsce package

# 验证打包文件
VSIX_FILE=$(ls *.vsix | head -n 1)
if [ ! -f "$VSIX_FILE" ]; then
    echo "❌ 打包失败: .vsix 文件不存在"
    exit 1
fi

echo "✅ 打包成功: $VSIX_FILE"

# 显示文件信息
echo "📋 打包文件信息:"
ls -lh *.vsix

echo ""
echo "🎉 构建验证完成!"
echo "✅ 扩展已成功构建和打包"
echo "📦 可以发布的文件: $VSIX_FILE"
echo ""
echo "下一步:"
echo "1. 测试扩展: code --install-extension $VSIX_FILE"
echo "2. 创建发布: ./scripts/release.sh patch"
echo "3. 推送到 GitHub: https://github.com/imkw/code-typer"