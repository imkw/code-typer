# Code Typer

[![Build and Test](https://github.com/imkw/code-typer/actions/workflows/build.yml/badge.svg)](https://github.com/imkw/code-typer/actions/workflows/build.yml)
[![Release](https://github.com/imkw/code-typer/actions/workflows/release.yml/badge.svg)](https://github.com/imkw/code-typer/actions/workflows/release.yml)

A VS Code extension that simulates human-like typing of code snippets with realistic timing and effects.

## 🌍 Multi-Language Support

This extension supports 5 languages with automatic detection based on your VS Code language settings:
- **English** (Default)
- **简体中文** (Simplified Chinese) 
- **繁體中文** (Traditional Chinese)
- **日本語** (Japanese)
- **한국어** (Korean)

## Features

- 🚀 **Multiple Typing Speeds**: Slow, Normal, and Fast typing modes
- ⌨️ **Realistic Typing Experience**: Simulates human typing rhythm with random delays
- 🎯 **Smart Character Recognition**: Adjusts typing speed based on character type (spaces, newlines, punctuation)
- 📊 **Progress Display**: Real-time progress with cancellation support
- 🔧 **Convenient Access**: Keyboard shortcuts and context menu integration
- 📝 **Multi-line Support**: Perfect handling of newlines and indentation
- 📁 **Template System**: Load pre-defined code templates from `.vscode/codetyper/` directory
- 🎮 **Status Bar Controls**: Play, pause, stop buttons in status bar for real-time control
- ⏯️ **Playback Control**: Full pause and resume functionality

## Installation

### From GitHub Releases
1. Go to [Releases page](https://github.com/imkw/code-typer/releases)
2. Download the latest `.vsix` file
3. In VS Code, press `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) to open command palette
4. Type "Extensions: Install from VSIX..."
5. Select the downloaded `.vsix` file to install

### Build from Source
```bash
git clone https://github.com/imkw/code-typer.git
cd code-typer
npm install
npm run compile
npm install -g @vscode/vsce
vsce package
```

## Usage

### Method 1: Keyboard Shortcuts
- Press `Ctrl+Shift+T` (Windows/Linux) or `Cmd+Shift+T` (Mac)
- Enter the code snippet to simulate typing
- Choose typing speed
- Watch the code being typed character by character

### Method 2: Command Palette
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac) to open command palette
2. Type "Type Code" to find available commands:
   - **Type Code**: Choose typing speed, supports manual input or template selection
   - **Type Code Slowly**: Slow typing mode
   - **Type Code Fast**: Fast typing mode
   - **Type From Template**: Select and type from template files

### Method 3: Context Menu
1. Right-click in the editor
2. Select "Type Code" option

### Method 4: Status Bar Controls
1. **Select Template**: Click "� Select Template" button in status bar to choose template files
2. **Play**: Click "▶️ Play" button to start typing (prompts for content if none selected)
3. **Pause/Resume**: During typing, click "⏸️ Pause" to pause, click "▶️ Resume" to continue
4. **Stop**: Click "⏹️ Stop" button to stop typing

> 💡 **Tip**: Status bar controls provide the most intuitive experience, especially for scenarios requiring frequent pause and resume.

## Template System

### Creating Templates
1. Create `.vscode/codetyper/` folder in your project root
2. Create text files with any extension in this folder
3. File contents will be available as code templates

### Using Templates
- Use "Type Code" command and select "From Template"
- Or directly use "Type From Template" command
- Click "� Select Template" button in status bar

### Example Templates
The project includes these example templates:
- `react-component.jsx` - React component example
- `express-server.js` - Node.js Express server
- `class-example.js` - JavaScript class definition example

## Multi-line Support

### Manual Input Mode
- Use `\n` for line breaks in input box
- Use `\t` for tab characters
- Example: `function test() {\n    return true;\n}`

### Template File Mode
- Line breaks and indentation in template files are preserved exactly
- Supports code snippets in any text format

## Typing Speed Guide

| Mode | Delay Range | Description |
|------|-------------|-------------|
| Slow | 100-300ms | Perfect for demos and teaching |
| Normal | 30-100ms | Simulates normal typing speed |
| Fast | 10-50ms | Quick code demonstration |

## Development

### Prerequisites
- Node.js
- npm

### Install Dependencies
```bash
npm install
```

### Compile
```bash
npm run compile
```

### Debug
1. Open project in VS Code
2. Press `F5` to start debugging
3. Test functionality in the new Extension Development Host window

### Package
```bash
npm run package
```

## Author

**Karl Wang** - [code@imkw.cn](mailto:code@imkw.cn)

GitHub: [https://github.com/imkw/code-typer](https://github.com/imkw/code-typer)

## License
MIT
