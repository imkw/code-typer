# 🌍 多语言支持 (Multi-language Support)

Code Typer 扩展现在支持多种语言界面，会根据 VS Code 的语言设置自动切换。

## 支持的语言 (Supported Languages)

| 语言 | Language Code | VS Code Locale |
|------|---------------|----------------|
| 🇺🇸 English (Default) | `en` | `en`, `en-us` |
| 🇨🇳 简体中文 | `zh-cn` | `zh-cn`, `zh-hans` |
| 🇹🇼 繁體中文 | `zh-tw` | `zh-tw`, `zh-hant` |
| 🇯🇵 日本語 | `ja` | `ja` |
| 🇰🇷 한국어 | `ko` | `ko` |

## 自动语言检测 (Automatic Language Detection)

扩展会自动检测 VS Code 的界面语言设置 (`vscode.env.language`) 并切换到对应的语言界面：

- **命令标题**: 在命令面板中显示的命令名称
- **状态栏文本**: 状态栏按钮的文字
- **错误消息**: 错误和成功提示消息
- **用户界面**: 所有输入框、选择框的提示文本

## 语言文件结构 (Language File Structure)

```
├── package.nls.json          # 英文 (默认)
├── package.nls.zh-cn.json    # 简体中文
├── package.nls.zh-tw.json    # 繁体中文
├── package.nls.ja.json       # 日语
├── package.nls.ko.json       # 韩语
└── src/i18n/
    └── index.ts              # TypeScript 国际化管理器
```

## 各语言界面预览 (Language Interface Preview)

### 🇺🇸 English
- **Commands**: Type Code, Type Code Slowly, Type Code Fast, etc.
- **Status Bar**: Select Template, Play, Pause, Stop
- **Messages**: "Please open a file first", "Template selected", etc.

### 🇨🇳 简体中文
- **命令**: 输入代码, 慢速输入代码, 快速输入代码, 等
- **状态栏**: 选择模板, 播放, 暂停, 停止
- **消息**: "请先打开一个文件", "已选择模板", 等

### 🇹🇼 繁體中文
- **命令**: 輸入程式碼, 慢速輸入程式碼, 快速輸入程式碼, 等
- **狀態列**: 選擇範本, 播放, 暫停, 停止
- **訊息**: "請先開啟一個檔案", "已選擇範本", 等

### 🇯🇵 日本語
- **コマンド**: コードを入力, ゆっくりコードを入力, 高速でコードを入力, など
- **ステータスバー**: テンプレートを選択, 再生, 一時停止, 停止
- **メッセージ**: "まずファイルを開いてください", "テンプレートが選択されました", など

### 🇰🇷 한국어
- **명령**: 코드 입력, 천천히 코드 입력, 빠르게 코드 입력, 등
- **상태 표시줄**: 템플릿 선택, 재생, 일시정지, 중지
- **메시지**: "먼저 파일을 열어주세요", "템플릿이 선택되었습니다", 등

## 技术实现 (Technical Implementation)

### VS Code NLS (Native Language Support)
扩展使用 VS Code 的内置国际化系统：
- `package.nls.*.json` 文件定义扩展元数据的翻译
- TypeScript 代码中使用动态语言管理器

### 语言检测逻辑
```typescript
// 自动检测 VS Code 语言设置
const vscodeLanguage = vscode.env.language;
const supportedLanguage = languageMap[vscodeLanguage.toLowerCase()] || 'en';
```

### 动态文本替换
所有用户界面文本都通过国际化管理器动态获取：
```typescript
const messages = i18n.getMessage();
vscode.window.showErrorMessage(messages.error.noActiveFile);
```

## 贡献翻译 (Contributing Translations)

如果您发现翻译错误或希望改进翻译质量，请：

1. 编辑对应的语言文件 (`package.nls.*.json` 和 `src/i18n/index.ts`)
2. 提交 Pull Request
3. 在问题描述中说明翻译改进的原因

## 添加新语言 (Adding New Languages)

要添加新语言支持：

1. 创建新的 `package.nls.[language-code].json` 文件
2. 在 `src/i18n/index.ts` 中添加语言映射和消息
3. 更新 `SupportedLanguage` 类型定义
4. 测试新语言的所有界面文本

---

**注意**: 扩展会自动根据 VS Code 的语言设置选择界面语言，无需手动配置。