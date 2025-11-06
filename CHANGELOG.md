# Changelog


## [1.0.1] - 2025-11-06

## [1.0.2] - 2025-11-06

### Changed
- Version bump to 1.0.2


### Changed
- Version bump to 1.0.1

All notable changes to the "code-typer" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-06

### Added
- 🚀 初始版本发布
- ⌨️ 模拟人类快速输入代码片段功能
- 🎯 三种输入速度支持（慢速、正常、快速）
- 📁 模板系统，支持从 `.vscode/codetyper/` 目录读取预设模板
- 🎮 状态栏控制功能，包括播放、暂停、停止按钮
- ⏯️ 播放控制，支持暂停和继续功能
- 📝 完整的多行代码和换行支持
- 🔧 快捷键支持 (`Ctrl+Shift+T` / `Cmd+Shift+T`)
- 📊 进度显示和取消操作支持
- 🎯 智能字符识别，根据字符类型调整输入速度

### Features
- **多种输入方式**: 快捷键、命令面板、右键菜单、状态栏控制
- **模板系统**: 支持 React、Express、JavaScript 等示例模板
- **真实打字体验**: 随机延迟变化，模拟真实打字节奏
- **智能字符处理**: 空格、换行、标点符号的差异化延迟

### Technical
- TypeScript 开发
- ESBuild 打包
- VS Code Extension API 集成
- Node.js fs/path 模块支持文件操作