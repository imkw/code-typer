# Changelog

All notable changes to the "code-typer" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- ✨ 字符输入特效功能
  - 🎆 粒子特效：每个字符输入后显示30毫秒的多彩粒子效果
  - 📱 状态栏闪烁：快速闪烁特效图标 (✨💥⚡🎆)
  - 🎛️ 特效开关：状态栏可点击切换特效开启/关闭
  - 🔧 新命令：`code-typer.toggleEffects` 控制特效状态
- 🎯 增强的视觉体验
  - 3-5个随机颜色粒子从输入位置散发
  - 粒子具有重力效果，自然下落动画
  - 60fps 动画循环，流畅的视觉效果
  - 轻量级实现，不影响编辑器性能

### Changed
- 🎨 状态栏布局优化，新增特效控制按钮
- ⚡ 改进打字循环，集成特效触发机制

## [1.0.4] - 2025-11-06

### Fixed
- 🔧 修复 GitHub Actions 发布流程权限问题
- 📦 更新为现代化的 GitHub Release Action
- 🚀 完善 CI/CD 自动化部署流程

## [1.0.3] - 2025-11-06

### Changed
- Version bump to 1.0.3

## [1.0.2] - 2025-11-06

### Changed
- Version bump to 1.0.2

## [1.0.1] - 2025-11-06

### Changed
- Version bump to 1.0.1

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