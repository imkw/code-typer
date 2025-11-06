// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { i18n } from './i18n';

// 配置不同的输入速度
interface TypingSpeed {
	name: string;
	minDelay: number;
	maxDelay: number;
	randomVariation: boolean;
}

// 获取本地化的速度配置
function getTypingSpeeds(): { [key: string]: TypingSpeed } {
	const messages = i18n.getMessage();
	return {
		slow: {
			name: messages.speed.slow,
			minDelay: 100,
			maxDelay: 300,
			randomVariation: true
		},
		normal: {
			name: messages.speed.normal,
			minDelay: 30,
			maxDelay: 100,
			randomVariation: true
		},
		fast: {
			name: messages.speed.fast,
			minDelay: 10,
			maxDelay: 50,
			randomVariation: true
		}
	};
}

// 全局状态管理
class CodeTyperState {
	public isTyping: boolean = false;
	public isPaused: boolean = false;
	public currentTemplate: string = '';
	public currentContent: string = '';
	public currentSpeed: TypingSpeed = getTypingSpeeds().normal;
	public cancellationTokenSource: vscode.CancellationTokenSource | undefined;

	
	public reset() {
		this.isTyping = false;
		this.isPaused = false;
		this.cancellationTokenSource?.cancel();
		this.cancellationTokenSource?.dispose();
		this.cancellationTokenSource = undefined;
	}
	
	public startTyping() {
		this.isTyping = true;
		this.isPaused = false;
		this.cancellationTokenSource = new vscode.CancellationTokenSource();
	}
	
	public pauseTyping() {
		this.isPaused = true;
	}
	
	public resumeTyping() {
		this.isPaused = false;
	}
	
	public stopTyping() {
		this.reset();
	}
}

const state = new CodeTyperState();


// 状态栏元素
let templateStatusBarItem: vscode.StatusBarItem;
let playStatusBarItem: vscode.StatusBarItem;
let pauseStatusBarItem: vscode.StatusBarItem;
let stopStatusBarItem: vscode.StatusBarItem;

// 模拟打字的核心函数
async function typeText(editor: vscode.TextEditor, text: string, speed: TypingSpeed, token?: vscode.CancellationToken): Promise<void> {
	const startPosition = editor.selection.active;
	let currentLine = startPosition.line;
	let currentCharacter = startPosition.character;
	
	for (let i = 0; i < text.length; i++) {
		// 检查是否被取消
		if (token?.isCancellationRequested) {
			return;
		}
		
		// 检查是否暂停
		while (state.isPaused && !token?.isCancellationRequested) {
			await new Promise(resolve => setTimeout(resolve, 100));
		}
		
		if (token?.isCancellationRequested) {
			return;
		}
		
		const char = text[i];
		
		// 在当前光标位置插入字符
		await editor.edit(editBuilder => {
			const position = new vscode.Position(currentLine, currentCharacter);
			editBuilder.insert(position, char);
		});
		
		// 更新光标位置
		if (char === '\n') {
			currentLine++;
			currentCharacter = 0;
		} else {
			currentCharacter++;
		}
		
		// 移动光标到新位置
		const newPosition = new vscode.Position(currentLine, currentCharacter);
		editor.selection = new vscode.Selection(newPosition, newPosition);
		
		// 自动滚动检查：如果当前行超过视窗50%高度，则滚动使当前行居中
		const visibleRange = editor.visibleRanges[0];
		if (visibleRange) {
			const visibleLines = visibleRange.end.line - visibleRange.start.line;
			const midPoint = visibleRange.start.line + Math.floor(visibleLines * 0.5);
			
			// 如果当前行超过了视窗的50%位置，则滚动使当前行居中
			// 但要确保当前行确实不在视窗中心附近，避免不必要的滚动
			if (currentLine >= midPoint) {
				// 计算当前行距离视窗中心的距离
				const viewportCenter = visibleRange.start.line + Math.floor(visibleLines * 0.5);
				const distanceFromCenter = Math.abs(currentLine - viewportCenter);
				
				// 只有当距离中心超过视窗高度的25%时才滚动，避免频繁滚动
				if (distanceFromCenter > Math.floor(visibleLines * 0.25)) {
					const range = new vscode.Range(newPosition, newPosition);
					editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
				}
			}
		}
		
		// 计算延迟时间
		let delay = speed.minDelay;
		if (speed.randomVariation) {
			delay = Math.random() * (speed.maxDelay - speed.minDelay) + speed.minDelay;
		}
		
		// 根据字符类型调整延迟
		if (char === ' ') {
			delay *= 0.5; // 空格打得快一些
		} else if (char === '\n') {
			delay *= 2; // 换行停顿长一些
		} else if (/[{}\[\](),.;]/.test(char)) {
			delay *= 1.2; // 标点符号稍微慢一些
		}
		
		// 等待指定时间
		await new Promise(resolve => setTimeout(resolve, delay));
	}
}

// 获取模板目录路径
function getTemplateDirectory(): string {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder) {
		const messages = i18n.getMessage();
		throw new Error(messages.error.noWorkspace);
	}
	return path.join(workspaceFolder.uri.fsPath, '.vscode', 'codetyper');
}

// 确保模板目录存在
async function ensureTemplateDirectory(): Promise<void> {
	const templateDir = getTemplateDirectory();
	if (!fs.existsSync(templateDir)) {
		fs.mkdirSync(templateDir, { recursive: true });
		
		// Create example template file
		const exampleTemplate = `// This is an example template file
function helloWorld() {
    console.log("Hello, World!");
    return "Welcome to Code Typer!";
}

// Call the function
helloWorld();`;
		
		fs.writeFileSync(path.join(templateDir, 'example.js'), exampleTemplate);
		
		const messages = i18n.getMessage();
		vscode.window.showInformationMessage(
			i18n.formatMessage(messages.success.templateDirectoryCreated, { 
				templateDir: templateDir,
				filename: 'example.js'
			})
		);
	}
}

// 获取模板文件列表
async function getTemplateFiles(): Promise<string[]> {
	const templateDir = getTemplateDirectory();
	
	if (!fs.existsSync(templateDir)) {
		await ensureTemplateDirectory();
	}
	
	try {
		const files = fs.readdirSync(templateDir);
		return files.filter(file => !file.startsWith('.') && fs.statSync(path.join(templateDir, file)).isFile());
	} catch (error) {
		const messages = i18n.getMessage();
		vscode.window.showErrorMessage(`${messages.error.readTemplateDirectory}: ${error}`);
		return [];
	}
}

// 选择模板文件
async function selectTemplateFile(): Promise<string | undefined> {
	const templateFiles = await getTemplateFiles();
	
	if (templateFiles.length === 0) {
		const messages = i18n.getMessage();
		const choice = await vscode.window.showInformationMessage(
			messages.input.templateDirectoryEmpty,
			messages.input.createExample,
			messages.input.cancel
		);
		
		if (choice === messages.input.createExample) {
			await ensureTemplateDirectory();
			return await selectTemplateFile();
		}
		return undefined;
	}
	
	const items = templateFiles.map(file => ({
		label: file,
		description: path.join('.vscode', 'codetyper', file)
	}));
	
	const messages = i18n.getMessage();
	const selected = await vscode.window.showQuickPick(items, {
		placeHolder: messages.input.selectTemplate
	});
	
	return selected?.label;
}

// 读取模板文件内容
async function readTemplateFile(filename: string): Promise<string | undefined> {
	const templateDir = getTemplateDirectory();
	const filePath = path.join(templateDir, filename);
	
	try {
		return fs.readFileSync(filePath, 'utf8');
	} catch (error) {
		const messages = i18n.getMessage();
		vscode.window.showErrorMessage(`${messages.error.readTemplateFile}: ${error}`);
		return undefined;
	}
}

// 获取用户输入的代码片段（支持多行）
async function getCodeSnippet(): Promise<{ content: string; isTemplate: boolean; templateName?: string } | undefined> {
	const messages = i18n.getMessage();
	// 首先询问用户是要手动输入还是从模板选择
	const choice = await vscode.window.showQuickPick([
		{
			label: messages.input.manualInput,
			description: messages.input.codeSnippetPrompt
		},
		{
			label: messages.input.fromTemplate,
			description: messages.input.selectTemplate
		}
	], {
		placeHolder: messages.input.selectInputMethod
	});
	
	if (!choice) {
		return undefined;
	}
	
	if (choice.label === messages.input.fromTemplate) {
		const templateFile = await selectTemplateFile();
		if (templateFile) {
			const content = await readTemplateFile(templateFile);
			if (content) {
				return { content, isTemplate: true, templateName: templateFile };
			}
		}
		return undefined;
	}
	
	// 手动输入模式
	const options: vscode.InputBoxOptions = {
		prompt: messages.input.codeSnippetPrompt,
		placeHolder: messages.input.codeSnippetPlaceholder,
		validateInput: (text: string) => {
			if (!text || text.trim().length === 0) {
				return messages.error.inputValidation;
			}
			return null;
		}
	};
	
	const input = await vscode.window.showInputBox(options);
	if (input) {
		// 处理转义的换行符
		const content = input.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
		return { content, isTemplate: false };
	}
	
	return undefined;
}

// 选择输入速度
async function selectTypingSpeed(): Promise<TypingSpeed | undefined> {
	const messages = i18n.getMessage();
	const typingSpeeds = getTypingSpeeds();
	const items = Object.values(typingSpeeds).map(speed => ({
		label: speed.name,
		description: `${messages.input.selectSpeed}: ${speed.minDelay}-${speed.maxDelay}ms`,
		speed: speed
	}));
	
	const selected = await vscode.window.showQuickPick(items, {
		placeHolder: messages.input.selectSpeed
	});
	
	return selected?.speed;
}

// 更新状态栏
function updateStatusBar() {
	const messages = i18n.getMessage();
	
	// 更新模板选择按钮
	templateStatusBarItem.text = state.currentTemplate 
		? `$(file-code) ${state.currentTemplate}` 
		: `$(file-code) ${messages.statusBar.selectTemplate}`;
	templateStatusBarItem.show();
	
	// 更新控制按钮
	if (state.isTyping) {
		playStatusBarItem.hide();
		if (state.isPaused) {
			pauseStatusBarItem.text = `$(play) ${messages.statusBar.resume}`;
		} else {
			pauseStatusBarItem.text = `$(debug-pause) ${messages.statusBar.pause}`;
		}
		pauseStatusBarItem.show();
		stopStatusBarItem.show();
	} else {
		if (state.currentContent) {
			playStatusBarItem.show();
		} else {
			playStatusBarItem.hide();
		}
		pauseStatusBarItem.hide();
		stopStatusBarItem.hide();
	}
}

// 执行输入操作
async function executeTyping(editor: vscode.TextEditor) {
	if (!state.currentContent) {
		const messages = i18n.getMessage();
		vscode.window.showErrorMessage(messages.error.noContentSelected);
		return;
	}
	
	try {
		state.startTyping();
		updateStatusBar();
		
		const messages = i18n.getMessage();
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: state.currentTemplate 
				? i18n.formatMessage(messages.progress.typingTemplate, { 
					speed: state.currentSpeed.name, 
					template: state.currentTemplate 
				})
				: i18n.formatMessage(messages.progress.typing, { 
					speed: state.currentSpeed.name 
				}),
			cancellable: true
		}, async (progress, token) => {
			// 将取消令牌与状态同步
			token.onCancellationRequested(() => {
				state.stopTyping();
				updateStatusBar();
			});
			
			await typeText(editor, state.currentContent, state.currentSpeed, state.cancellationTokenSource?.token);
			
			state.stopTyping();
			updateStatusBar();
		});
	} catch (error) {
		state.stopTyping();
		updateStatusBar();
		const messages = i18n.getMessage();
		vscode.window.showErrorMessage(`${messages.error.executionFailed}: ${error}`);
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Code Typer extension has been activated!');

	// 初始化状态栏元素
	const messages = i18n.getMessage();
	
	templateStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	templateStatusBarItem.command = 'code-typer.selectTemplate';
	templateStatusBarItem.tooltip = messages.statusBar.selectTemplate;
	
	playStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
	playStatusBarItem.command = 'code-typer.play';
	playStatusBarItem.text = `$(play) ${messages.statusBar.play}`;
	playStatusBarItem.tooltip = messages.statusBar.play;
	
	pauseStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 98);
	pauseStatusBarItem.command = 'code-typer.pause';
	pauseStatusBarItem.tooltip = `${messages.statusBar.pause}/${messages.statusBar.resume}`;
	
	stopStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 97);
	stopStatusBarItem.command = 'code-typer.stop';
	stopStatusBarItem.text = `$(debug-stop) ${messages.statusBar.stop}`;
	stopStatusBarItem.tooltip = messages.statusBar.stop;

	// 初始状态栏显示
	updateStatusBar();

	// 选择模板命令
	const selectTemplateCommand = vscode.commands.registerCommand('code-typer.selectTemplate', async () => {
		try {
			await ensureTemplateDirectory();
			const templateFile = await selectTemplateFile();
			if (templateFile) {
				const content = await readTemplateFile(templateFile);
				if (content) {
					state.currentTemplate = templateFile;
					state.currentContent = content;
					// 默认使用正常速度
					state.currentSpeed = getTypingSpeeds().normal;
					updateStatusBar();
					const messages = i18n.getMessage();
					vscode.window.showInformationMessage(`${messages.success.templateSelected}: ${templateFile}`);
				}
			}
		} catch (error) {
			const messages = i18n.getMessage();
			vscode.window.showErrorMessage(`${messages.error.selectTemplate}: ${error}`);
		}
	});

	// 播放命令
	const playCommand = vscode.commands.registerCommand('code-typer.play', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			const messages = i18n.getMessage();
			vscode.window.showErrorMessage(messages.error.noActiveFile);
			return;
		}

		if (!state.currentContent) {
			// 如果没有选择内容，先获取
			const result = await getCodeSnippet();
			if (!result) {
				return;
			}
			
			state.currentContent = result.content;
			state.currentTemplate = result.isTemplate && result.templateName ? result.templateName : '';
			
			// 选择输入速度
			const speed = await selectTypingSpeed();
			if (!speed) {
				return;
			}
			state.currentSpeed = speed;
			updateStatusBar();
		}

		await executeTyping(editor);
	});

	// 暂停/继续命令
	const pauseCommand = vscode.commands.registerCommand('code-typer.pause', () => {
		if (state.isTyping) {
			if (state.isPaused) {
				state.resumeTyping();
			} else {
				state.pauseTyping();
			}
			updateStatusBar();
		}
	});

	// 停止命令
	const stopCommand = vscode.commands.registerCommand('code-typer.stop', () => {
		state.stopTyping();
		updateStatusBar();
	});

	// 主要命令：Type Code（可选择速度）
	const typeCodeCommand = vscode.commands.registerCommand('code-typer.typeCode', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			const messages = i18n.getMessage();
			vscode.window.showErrorMessage(messages.error.noActiveFile);
			return;
		}

		try {
			// 获取代码片段
			const result = await getCodeSnippet();
			if (!result) {
				return;
			}

			// 更新状态
			state.currentContent = result.content;
			state.currentTemplate = result.isTemplate && result.templateName ? result.templateName : '';

			// 选择输入速度
			const speed = await selectTypingSpeed();
			if (!speed) {
				return;
			}
			state.currentSpeed = speed;
			updateStatusBar();

			await executeTyping(editor);

		} catch (error) {
			const messages = i18n.getMessage();
			vscode.window.showErrorMessage(`${messages.error.typeCode}: ${error}`);
		}
	});

	// 慢速输入命令
	const typeCodeSlowlyCommand = vscode.commands.registerCommand('code-typer.typeCodeSlowly', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			const messages = i18n.getMessage();
			vscode.window.showErrorMessage(messages.error.noActiveFile);
			return;
		}

		try {
			const result = await getCodeSnippet();
			if (!result) {
				return;
			}

			state.currentContent = result.content;
			state.currentTemplate = result.isTemplate && result.templateName ? result.templateName : '';
			state.currentSpeed = getTypingSpeeds().slow;
			updateStatusBar();

			await executeTyping(editor);

		} catch (error) {
			const messages = i18n.getMessage();
			vscode.window.showErrorMessage(`${messages.error.typeCode}: ${error}`);
		}
	});

	// 快速输入命令
	const typeCodeFastCommand = vscode.commands.registerCommand('code-typer.typeCodeFast', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			const messages = i18n.getMessage();
			vscode.window.showErrorMessage(messages.error.noActiveFile);
			return;
		}

		try {
			const result = await getCodeSnippet();
			if (!result) {
				return;
			}

			state.currentContent = result.content;
			state.currentTemplate = result.isTemplate && result.templateName ? result.templateName : '';
			state.currentSpeed = getTypingSpeeds().fast;
			updateStatusBar();

			await executeTyping(editor);

		} catch (error) {
			const messages = i18n.getMessage();
			vscode.window.showErrorMessage(`${messages.error.typeCode}: ${error}`);
		}
	});

	// 从模板文件输入命令
	const typeFromTemplateCommand = vscode.commands.registerCommand('code-typer.typeFromTemplate', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			const messages = i18n.getMessage();
			vscode.window.showErrorMessage(messages.error.noActiveFile);
			return;
		}

		try {
			// 确保模板目录存在
			await ensureTemplateDirectory();

			// 选择模板文件
			const templateFile = await selectTemplateFile();
			if (!templateFile) {
				return;
			}

			// 读取模板内容
			const templateContent = await readTemplateFile(templateFile);
			if (!templateContent) {
				return;
			}

			// 选择输入速度
			const speed = await selectTypingSpeed();
			if (!speed) {
				return;
			}

			// 更新状态
			state.currentContent = templateContent;
			state.currentTemplate = templateFile;
			state.currentSpeed = speed;
			updateStatusBar();

			await executeTyping(editor);

		} catch (error) {
			const messages = i18n.getMessage();
			vscode.window.showErrorMessage(`${messages.error.fromTemplate}: ${error}`);
		}
	});

	// 注册所有命令和状态栏元素
	context.subscriptions.push(
		typeCodeCommand,
		typeCodeSlowlyCommand, 
		typeCodeFastCommand,
		typeFromTemplateCommand,
		selectTemplateCommand,
		playCommand,
		pauseCommand,
		stopCommand,
		templateStatusBarItem,
		playStatusBarItem,
		pauseStatusBarItem,
		stopStatusBarItem
	);
}

// This method is called when your extension is deactivated
export function deactivate() {
	state.reset();
}
