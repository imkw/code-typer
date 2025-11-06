import * as vscode from 'vscode';

// 支持的语言列表
export type SupportedLanguage = 'en' | 'zh-cn' | 'zh-tw' | 'ja' | 'ko';

// 所有文本的类型定义
export interface Messages {
	// 错误消息
	error: {
		noActiveFile: string;
		noWorkspace: string;
		readTemplateFile: string;
		readTemplateDirectory: string;
		typeCode: string;
		inputValidation: string;
		selectTemplate: string;
		fromTemplate: string;
		noContentSelected: string;
		executionFailed: string;
	};
	
	// 成功消息
	success: {
		templateDirectoryCreated: string;
		templateSelected: string;
	};
	
	// 输入提示
	input: {
		codeSnippetPrompt: string;
		codeSnippetPlaceholder: string;
		selectInputMethod: string;
		manualInput: string;
		fromTemplate: string;
		selectTemplate: string;
		selectSpeed: string;
		createExample: string;
		cancel: string;
		templateDirectoryEmpty: string;
	};
	
	// 状态栏
	statusBar: {
		selectTemplate: string;
		play: string;
		pause: string;
		resume: string;
		stop: string;
	};
	
	// 速度设置
	speed: {
		slow: string;
		normal: string;
		fast: string;
	};
	
	// 进度提示
	progress: {
		typing: string;
		typingTemplate: string;
	};
}

// 默认英文消息
const defaultMessages: Messages = {
	error: {
		noActiveFile: 'Please open a file first',
		noWorkspace: 'Please open a workspace first',
		readTemplateFile: 'Failed to read template file',
		readTemplateDirectory: 'Failed to read template directory',
		typeCode: 'Failed to type code',
		inputValidation: 'Please enter a valid code snippet',
		selectTemplate: 'Failed to select template',
		fromTemplate: 'Failed to type from template',
		noContentSelected: 'No content selected for typing',
		executionFailed: 'Execution failed'
	},
	success: {
		templateDirectoryCreated: 'Template directory created: {templateDir}\nExample file {filename} added',
		templateSelected: 'Template selected'
	},
	input: {
		codeSnippetPrompt: 'Enter the code snippet to simulate typing (use \\n for line breaks)',
		codeSnippetPlaceholder: 'console.log("Hello, World!");\\nfunction test() {\\n    return true;\\n}',
		selectInputMethod: 'Select input method',
		manualInput: 'Manual Input',
		fromTemplate: 'From Template',
		selectTemplate: 'Select template file to type',
		selectSpeed: 'Select typing speed',
		createExample: 'Create Example',
		cancel: 'Cancel',
		templateDirectoryEmpty: 'Template directory is empty. Create example template?'
	},
	statusBar: {
		selectTemplate: 'Select Template',
		play: 'Play',
		pause: 'Pause',
		resume: 'Resume',
		stop: 'Stop'
	},
	speed: {
		slow: 'Slow',
		normal: 'Normal',
		fast: 'Fast'
	},
	progress: {
		typing: 'Typing code at {speed} speed...',
		typingTemplate: 'Typing template {template} at {speed} speed...'
	}
};

// 简体中文消息
const zhCnMessages: Messages = {
	error: {
		noActiveFile: '请先打开一个文件',
		noWorkspace: '请先打开一个工作区',
		readTemplateFile: '读取模板文件失败',
		readTemplateDirectory: '读取模板目录失败',
		typeCode: '输入失败',
		inputValidation: '请输入有效的代码片段',
		selectTemplate: '选择模板失败',
		fromTemplate: '从模板输入失败',
		noContentSelected: '没有选择要输入的内容',
		executionFailed: '执行失败'
	},
	success: {
		templateDirectoryCreated: '已创建模板目录并添加了示例文件',
		templateSelected: '已选择模板'
	},
	input: {
		codeSnippetPrompt: '请输入要模拟输入的代码片段（支持换行，使用 \\n 表示换行）',
		codeSnippetPlaceholder: 'console.log("Hello, World!");\\nfunction test() {\\n    return true;\\n}',
		selectInputMethod: '选择输入方式',
		manualInput: '手动输入',
		fromTemplate: '从模板选择',
		selectTemplate: '选择要输入的模板文件',
		selectSpeed: '选择输入速度',
		createExample: '创建示例',
		cancel: '取消',
		templateDirectoryEmpty: '模板目录为空，是否创建示例模板？'
	},
	statusBar: {
		selectTemplate: '选择模板',
		play: '播放',
		pause: '暂停',
		resume: '继续',
		stop: '停止'
	},
	speed: {
		slow: '慢速',
		normal: '正常',
		fast: '快速'
	},
	progress: {
		typing: '正在以{speed}速度输入代码...',
		typingTemplate: '正在以{speed}速度输入模板 {template}...'
	}
};

// 繁体中文消息
const zhTwMessages: Messages = {
	error: {
		noActiveFile: '請先開啟一個檔案',
		noWorkspace: '請先開啟一個工作區',
		readTemplateFile: '讀取範本檔案失敗',
		readTemplateDirectory: '讀取範本目錄失敗',
		typeCode: '輸入失敗',
		inputValidation: '請輸入有效的程式碼片段',
		selectTemplate: '選擇範本失敗',
		fromTemplate: '從範本輸入失敗',
		noContentSelected: '沒有選擇要輸入的內容',
		executionFailed: '執行失敗'
	},
	success: {
		templateDirectoryCreated: '已创建模板目录：{templateDir}\n并添加了示例文件 {filename}',
		templateSelected: '已选择模板'
	},
	input: {
		codeSnippetPrompt: '請輸入要模擬輸入的程式碼片段（支援換行，使用 \\n 表示換行）',
		codeSnippetPlaceholder: 'console.log("Hello, World!");\\nfunction test() {\\n    return true;\\n}',
		selectInputMethod: '選擇輸入方式',
		manualInput: '手動輸入',
		fromTemplate: '從範本選擇',
		selectTemplate: '選擇要輸入的範本檔案',
		selectSpeed: '選擇輸入速度',
		createExample: '建立範例',
		cancel: '取消',
		templateDirectoryEmpty: '範本目錄為空，是否建立範例範本？'
	},
	statusBar: {
		selectTemplate: '選擇範本',
		play: '播放',
		pause: '暫停',
		resume: '繼續',
		stop: '停止'
	},
	speed: {
		slow: '慢速',
		normal: '正常',
		fast: '快速'
	},
	progress: {
		typing: '正在以{speed}速度輸入程式碼...',
		typingTemplate: '正在以{speed}速度輸入範本 {template}...'
	}
};

// 日语消息
const jaMessages: Messages = {
	error: {
		noActiveFile: 'まずファイルを開いてください',
		noWorkspace: 'まずワークスペースを開いてください',
		readTemplateFile: 'テンプレートファイルの読み取りに失敗しました',
		readTemplateDirectory: 'テンプレートディレクトリの読み取りに失敗しました',
		typeCode: '入力に失敗しました',
		inputValidation: '有効なコードスニペットを入力してください',
		selectTemplate: 'テンプレートの選択に失敗しました',
		fromTemplate: 'テンプレートからの入力に失敗しました',
		noContentSelected: '入力するコンテンツが選択されていません',
		executionFailed: '実行に失敗しました'
	},
	success: {
		templateDirectoryCreated: '已建立範本目錄：{templateDir}\n並新增了範例檔案 {filename}',
		templateSelected: '已選擇範本'
	},
	input: {
		codeSnippetPrompt: 'タイピングをシミュレートするコードスニペットを入力してください（改行には \\n を使用）',
		codeSnippetPlaceholder: 'console.log("Hello, World!");\\nfunction test() {\\n    return true;\\n}',
		selectInputMethod: '入力方法を選択',
		manualInput: '手動入力',
		fromTemplate: 'テンプレートから',
		selectTemplate: '入力するテンプレートファイルを選択',
		selectSpeed: 'タイピング速度を選択',
		createExample: '例を作成',
		cancel: 'キャンセル',
		templateDirectoryEmpty: 'テンプレートディレクトリが空です。サンプルテンプレートを作成しますか？'
	},
	statusBar: {
		selectTemplate: 'テンプレートを選択',
		play: '再生',
		pause: '一時停止',
		resume: '再開',
		stop: '停止'
	},
	speed: {
		slow: 'ゆっくり',
		normal: '通常',
		fast: '高速'
	},
	progress: {
		typing: '{speed}速度でコードを入力中...',
		typingTemplate: '{speed}速度でテンプレート {template} を入力中...'
	}
};

// 韩语消息
const koMessages: Messages = {
	error: {
		noActiveFile: '먼저 파일을 열어주세요',
		noWorkspace: '먼저 워크스페이스를 열어주세요',
		readTemplateFile: '템플릿 파일 읽기에 실패했습니다',
		readTemplateDirectory: '템플릿 디렉토리 읽기에 실패했습니다',
		typeCode: '입력에 실패했습니다',
		inputValidation: '유효한 코드 스니펫을 입력해주세요',
		selectTemplate: '템플릿 선택에 실패했습니다',
		fromTemplate: '템플릿에서 입력에 실패했습니다',
		noContentSelected: '입력할 콘텐츠가 선택되지 않았습니다',
		executionFailed: '실행에 실패했습니다'
	},
	success: {
		templateDirectoryCreated: '템플릿 디렉토리가 생성되었습니다: {templateDir}\n예제 파일 {filename}이 추가되었습니다',
		templateSelected: '템플릿이 선택되었습니다'
	},
	input: {
		codeSnippetPrompt: '타이핑을 시뮬레이션할 코드 스니펫을 입력하세요 (줄바꿈은 \\n 사용)',
		codeSnippetPlaceholder: 'console.log("Hello, World!");\\nfunction test() {\\n    return true;\\n}',
		selectInputMethod: '입력 방법 선택',
		manualInput: '수동 입력',
		fromTemplate: '템플릿에서',
		selectTemplate: '입력할 템플릿 파일 선택',
		selectSpeed: '타이핑 속도 선택',
		createExample: '예제 생성',
		cancel: '취소',
		templateDirectoryEmpty: '템플릿 디렉토리가 비어있습니다. 예제 템플릿을 생성하시겠습니까?'
	},
	statusBar: {
		selectTemplate: '템플릿 선택',
		play: '재생',
		pause: '일시정지',
		resume: '재개',
		stop: '중지'
	},
	speed: {
		slow: '느림',
		normal: '보통',
		fast: '빠름'
	},
	progress: {
		typing: '{speed} 속도로 코드 입력 중...',
		typingTemplate: '{speed} 속도로 템플릿 {template} 입력 중...'
	}
};

// 语言消息映射
const messagesMap: Record<SupportedLanguage, Messages> = {
	'en': defaultMessages,
	'zh-cn': zhCnMessages,
	'zh-tw': zhTwMessages,
	'ja': jaMessages,
	'ko': koMessages
};

// 国际化管理器类
export class I18nManager {
	private currentLanguage: SupportedLanguage = 'en';
	private messages: Messages = defaultMessages;

	constructor() {
		this.detectLanguage();
	}

	/**
	 * 检测当前 VS Code 的语言设置
	 */
	private detectLanguage(): void {
		const vscodeLanguage = vscode.env.language;
		
		// 映射 VS Code 语言到支持的语言
		const languageMap: Record<string, SupportedLanguage> = {
			'en': 'en',
			'en-us': 'en',
			'zh-cn': 'zh-cn',
			'zh-hans': 'zh-cn',
			'zh-tw': 'zh-tw',
			'zh-hant': 'zh-tw',
			'ja': 'ja',
			'ko': 'ko'
		};

		this.currentLanguage = languageMap[vscodeLanguage.toLowerCase()] || 'en';
		this.messages = messagesMap[this.currentLanguage];
	}

	/**
	 * 获取当前语言
	 */
	getCurrentLanguage(): SupportedLanguage {
		return this.currentLanguage;
	}

	/**
	 * 设置语言
	 */
	setLanguage(language: SupportedLanguage): void {
		this.currentLanguage = language;
		this.messages = messagesMap[language];
	}

	/**
	 * 获取消息
	 */
	getMessage(): Messages {
		return this.messages;
	}

	/**
	 * 格式化带占位符的消息
	 */
	formatMessage(template: string, params: Record<string, string>): string {
		let result = template;
		for (const [key, value] of Object.entries(params)) {
			result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
		}
		return result;
	}
}

// 全局实例
export const i18n = new I18nManager();