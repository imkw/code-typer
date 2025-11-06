# Code Typer

[![Build and Test](https://github.com/imkw/code-typer/actions/workflows/build.yml/badge.svg)](https://github.com/imkw/code-typer/actions/workflows/build.yml)
[![Release](https://github.com/imkw/code-typer/actions/workflows/release.yml/badge.svg)](https://github.com/imkw/code-typer/actions/workflows/release.yml)

一个 VS Code 扩展，用于模拟人类快速输入代码片段的效果。

## 安装

### 从 GitHub Releases 安装
1. 前往 [Releases 页面](https://github.com/imkw/code-typer/releases)
2. 下载最新版本的 `.vsix` 文件
3. 在 VS Code 中按 `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) 打开命令面板
4. 输入 "Extensions: Install from VSIX..."
5. 选择下载的 `.vsix` 文件进行安装

### 从源码构建
```bash
git clone https://github.com/imkw/code-typer.git
cd code-typer
npm install
npm run compile
npm install -g @vscode/vsce
vsce package
```

## 功能特点

- 🚀 **多种输入速度**：支持慢速、正常和快速三种输入模式
- ⌨️ **真实打字体验**：模拟真实的人类打字节奏，包括随机延迟
- 🎯 **智能字符识别**：根据不同字符类型（空格、换行、标点符号）调整输入速度
- 📊 **进度显示**：实时显示输入进度，支持取消操作
- 🔧 **便捷操作**：提供快捷键和右键菜单快速访问
- 📝 **换行支持**：完美支持多行代码输入，正确处理换行和缩进
- 📁 **模板系统**：支持从 `.vscode/codetyper/` 目录读取预设模板文件
- 🎮 **状态栏控制**：在状态栏提供播放、暂停、停止按钮，支持实时控制
- ⏯️ **播放控制**：支持暂停和继续功能，完全控制输入过程

## 使用方法

### 方式 1：使用快捷键
- 按 `Ctrl+Shift+T` (Windows/Linux) 或 `Cmd+Shift+T` (Mac)
- 输入要模拟输入的代码片段
- 选择输入速度
- 观看代码逐字符输入

### 方式 2：使用命令面板
1. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac) 打开命令面板
2. 输入 "Type Code" 找到相关命令：
   - **Type Code**: 可选择输入速度，支持手动输入或模板选择
   - **Type Code Slowly**: 慢速输入
   - **Type Code Fast**: 快速输入
   - **Type From Template**: 直接从模板文件选择并输入

### 方式 3：使用右键菜单
1. 在编辑器中右键点击
2. 选择 "Type Code" 选项

### 方式 4：使用状态栏控制
1. **选择模板**：点击状态栏左侧的 "🗂️ 选择模板" 按钮选择模板文件
2. **播放**：点击 "▶️ 播放" 按钮开始输入（如果没有选择内容会提示选择）
3. **暂停/继续**：在输入过程中点击 "⏸️ 暂停" 按钮暂停，点击 "▶️ 继续" 按钮继续
4. **停止**：点击 "⏹️ 停止" 按钮停止输入

> 💡 **提示**：状态栏控制提供了最直观的操作体验，特别适合需要频繁暂停和继续的场景。

## 模板系统

### 创建模板
1. 在项目根目录创建 `.vscode/codetyper/` 文件夹
2. 在该文件夹中创建任意扩展名的文本文件
3. 文件内容将作为代码模板供选择使用

### 使用模板
- 使用 "Type Code" 命令时选择"从模板选择"
- 或直接使用 "Type From Template" 命令
- 点击状态栏的 "🗂️ 选择模板" 按钮

### 示例模板
项目已包含以下示例模板：
- `react-component.jsx` - React 组件示例
- `express-server.js` - Node.js Express 服务器
- `class-example.js` - JavaScript 类定义示例

## 换行支持

### 手动输入模式
- 在输入框中使用 `\n` 表示换行
- 使用 `\t` 表示制表符
- 示例：`function test() {\n    return true;\n}`

### 模板文件模式
- 模板文件中的换行和缩进会被原样保留
- 支持任何文本格式的代码片段

## 输入速度说明

| 模式 | 延迟范围 | 描述 |
|------|----------|------|
| 慢速 | 100-300ms | 适合演示和教学 |
| 正常 | 30-100ms | 模拟正常打字速度 |
| 快速 | 10-50ms | 快速展示代码 |

## 开发

### 前置要求
- Node.js
- npm

### 安装依赖
```bash
npm install
```

### 编译
```bash
npm run compile
```

### 调试
1. 在 VS Code 中打开项目
2. 按 `F5` 启动调试
3. 在新打开的扩展开发窗口中测试功能

### 打包
```bash
npm run package
```

## 作者

**Karl Wang** - [code@imkw.cn](mailto:code@imkw.cn)

GitHub: [https://github.com/imkw/code-typer](https://github.com/imkw/code-typer)

## 许可证
MIT
