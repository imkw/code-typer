# Code Typer VS Code Extension

## 项目概述
Code Typer 是一个 VS Code 扩展，主要功能是模拟人类快速输入代码片段的效果。用户可以输入代码片段，扩展会逐字符地输入代码，模拟真实的打字体验。

## 主要功能
- 支持三种输入速度：慢速、正常、快速
- 可自定义输入延迟和随机变化
- 根据字符类型调整输入速度（空格、换行、标点符号）
- 支持进度显示和取消操作
- 提供快捷键和右键菜单
- 完整的换行和多行代码支持
- 模板系统：从 .vscode/codetyper/ 目录读取预设模板文件
- 状态栏控制：播放、暂停、停止按钮
- 播放控制：支持暂停和继续功能

## 技术栈
- TypeScript
- VS Code Extension API
- ESBuild (打包工具)
- Node.js fs/path 模块
- npm (包管理器)

## 命令列表
- `code-typer.typeCode`: 主要命令，可选择输入速度和输入方式（手动/模板）
- `code-typer.typeCodeSlowly`: 慢速输入代码
- `code-typer.typeCodeFast`: 快速输入代码
- `code-typer.typeFromTemplate`: 直接从模板文件选择并输入
- `code-typer.selectTemplate`: 选择模板文件
- `code-typer.play`: 播放/开始输入
- `code-typer.pause`: 暂停/继续输入
- `code-typer.stop`: 停止输入

## 开发说明
项目使用 TypeScript 开发，采用 ESBuild 进行打包。调试时会启动一个新的 VS Code 窗口来测试扩展功能。

## 作者信息
- **作者**: Karl Wang
- **邮箱**: code@imkw.cn
- **GitHub**: https://github.com/imkw/code-typer