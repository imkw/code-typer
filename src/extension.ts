// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// 配置不同的输入速度
interface TypingSpeed {
	name: string;
	minDelay: number;
	maxDelay: number;
	randomVariation: boolean;
}

const TYPING_SPEEDS: { [key: string]: TypingSpeed } = {
	slow: {
		name: '慢速',
		minDelay: 100,
		maxDelay: 300,
		randomVariation: true
	},
	normal: {
		name: '正常',
		minDelay: 30,
		maxDelay: 100,
		randomVariation: true
	},
	fast: {
		name: '快速',
		minDelay: 10,
		maxDelay: 50,
		randomVariation: true
	}
};

// 全局状态管理
class CodeTyperState {
	public isTyping: boolean = false;
	public isPaused: boolean = false;
	public currentTemplate: string = '';
	public currentContent: string = '';
	public currentSpeed: TypingSpeed = TYPING_SPEEDS.normal;
	public cancellationTokenSource: vscode.CancellationTokenSource | undefined;
	public effectsEnabled: boolean = false; // 特效开关
	
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

// 粒子特效和窗口抖动
interface ParticleEffect {
	id: string;
	x: number;
	y: number;
	vx: number;
	vy: number;
	life: number;
	maxLife: number;
	color: string;
}

let activeParticles: ParticleEffect[] = [];
let particleAnimationId: NodeJS.Timeout | undefined;

// 创建粒子特效
function createParticleEffect(editor: vscode.TextEditor) {
	if (!state.effectsEnabled) {
		return;
	}
	
	// 获取当前光标位置
	const position = editor.selection.active;
	const visibleRange = editor.visibleRanges[0];
	
	// 计算相对位置（简化版，实际位置可能需要更复杂的计算）
	const lineOffset = position.line - visibleRange.start.line;
	const charOffset = position.character;
	
	// 创建多个粒子
	const particleCount = 3 + Math.floor(Math.random() * 3); // 3-5个粒子
	const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
	
	for (let i = 0; i < particleCount; i++) {
		const particle: ParticleEffect = {
			id: Math.random().toString(36).substr(2, 9),
			x: charOffset * 8 + Math.random() * 20 - 10, // 假设字符宽度8px
			y: lineOffset * 20 + Math.random() * 20 - 10, // 假设行高20px
			vx: (Math.random() - 0.5) * 4, // 水平速度
			vy: (Math.random() - 0.5) * 4 - 2, // 垂直速度（稍微向上）
			life: 30, // 30毫秒生命周期
			maxLife: 30,
			color: colors[Math.floor(Math.random() * colors.length)]
		};
		activeParticles.push(particle);
	}
	
	// 如果还没有动画循环，启动它
	if (!particleAnimationId) {
		startParticleAnimation();
	}
}

// 粒子动画循环
function startParticleAnimation() {
	particleAnimationId = setInterval(() => {
		// 更新所有粒子
		activeParticles = activeParticles.filter(particle => {
			particle.life--;
			particle.x += particle.vx;
			particle.y += particle.vy;
			particle.vy += 0.1; // 重力效果
			
			return particle.life > 0;
		});
		
		// 如果没有活跃粒子，停止动画
		if (activeParticles.length === 0 && particleAnimationId) {
			clearInterval(particleAnimationId);
			particleAnimationId = undefined;
		}
	}, 16); // 约60fps
}

// 窗口抖动效果
async function createShakeEffect() {
	if (!state.effectsEnabled) {
		return;
	}
	
	// 使用 VS Code 的状态栏闪烁来模拟视觉反馈
	// 因为我们无法直接控制 VS Code 窗口抖动
	try {
		// 创建一个临时的状态栏项目来显示特效
		const tempEffectItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
		tempEffectItem.text = '✨';
		tempEffectItem.show();
		
		// 快速闪烁效果
		const flashSequence = ['✨', '💥', '⚡', '🎆', '✨'];
		for (let i = 0; i < flashSequence.length; i++) {
			tempEffectItem.text = flashSequence[i];
			await new Promise(resolve => setTimeout(resolve, 6)); // 6ms间隔，总共30ms
		}
		
		// 清理临时项目
		tempEffectItem.hide();
		tempEffectItem.dispose();
	} catch (error) {
		// 忽略错误
	}
}

// 状态栏元素
let templateStatusBarItem: vscode.StatusBarItem;
let playStatusBarItem: vscode.StatusBarItem;
let pauseStatusBarItem: vscode.StatusBarItem;
let stopStatusBarItem: vscode.StatusBarItem;
let effectsStatusBarItem: vscode.StatusBarItem;

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
		
		// 触发特效（如果启用）
		if (state.effectsEnabled) {
			// 创建粒子特效
			createParticleEffect(editor);
			// 创建窗口抖动效果
			createShakeEffect();
		}
		
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
		throw new Error('请先打开一个工作区');
	}
	return path.join(workspaceFolder.uri.fsPath, '.vscode', 'codetyper');
}

// 确保模板目录存在
async function ensureTemplateDirectory(): Promise<void> {
	const templateDir = getTemplateDirectory();
	if (!fs.existsSync(templateDir)) {
		fs.mkdirSync(templateDir, { recursive: true });
		
		// 创建示例模板文件
		const exampleTemplate = `// 这是一个示例模板文件
function helloWorld() {
    console.log("Hello, World!");
    return "Welcome to Code Typer!";
}

// 调用函数
helloWorld();`;
		
		fs.writeFileSync(path.join(templateDir, 'example.js'), exampleTemplate);
		
		vscode.window.showInformationMessage(`已创建模板目录：${templateDir}\n并添加了示例文件 example.js`);
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
		vscode.window.showErrorMessage(`读取模板目录失败: ${error}`);
		return [];
	}
}

// 选择模板文件
async function selectTemplateFile(): Promise<string | undefined> {
	const templateFiles = await getTemplateFiles();
	
	if (templateFiles.length === 0) {
		const choice = await vscode.window.showInformationMessage(
			'模板目录为空，是否创建示例模板？',
			'创建示例',
			'取消'
		);
		
		if (choice === '创建示例') {
			await ensureTemplateDirectory();
			return await selectTemplateFile();
		}
		return undefined;
	}
	
	const items = templateFiles.map(file => ({
		label: file,
		description: path.join('.vscode', 'codetyper', file)
	}));
	
	const selected = await vscode.window.showQuickPick(items, {
		placeHolder: '选择要输入的模板文件'
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
		vscode.window.showErrorMessage(`读取模板文件失败: ${error}`);
		return undefined;
	}
}

// 获取用户输入的代码片段（支持多行）
async function getCodeSnippet(): Promise<{ content: string; isTemplate: boolean; templateName?: string } | undefined> {
	// 首先询问用户是要手动输入还是从模板选择
	const choice = await vscode.window.showQuickPick([
		{
			label: '手动输入',
			description: '在输入框中输入代码片段'
		},
		{
			label: '从模板选择',
			description: '从 .vscode/codetyper/ 目录选择模板文件'
		}
	], {
		placeHolder: '选择输入方式'
	});
	
	if (!choice) {
		return undefined;
	}
	
	if (choice.label === '从模板选择') {
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
		prompt: '请输入要模拟输入的代码片段（支持换行，使用 \\n 表示换行）',
		placeHolder: 'console.log("Hello, World!");\\nfunction test() {\\n    return true;\\n}',
		validateInput: (text: string) => {
			if (!text || text.trim().length === 0) {
				return '请输入有效的代码片段';
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
	const items = Object.values(TYPING_SPEEDS).map(speed => ({
		label: speed.name,
		description: `延迟: ${speed.minDelay}-${speed.maxDelay}ms`,
		speed: speed
	}));
	
	const selected = await vscode.window.showQuickPick(items, {
		placeHolder: '选择输入速度'
	});
	
	return selected?.speed;
}

// 更新状态栏
function updateStatusBar() {
	// 更新模板选择按钮
	templateStatusBarItem.text = state.currentTemplate ? `$(file-code) ${state.currentTemplate}` : '$(file-code) 选择模板';
	templateStatusBarItem.show();
	
	// 更新特效开关按钮
	effectsStatusBarItem.text = state.effectsEnabled ? '$(sparkle) 特效开' : '$(circle-outline) 特效关';
	effectsStatusBarItem.show();
	
	// 更新控制按钮
	if (state.isTyping) {
		playStatusBarItem.hide();
		if (state.isPaused) {
			pauseStatusBarItem.text = '$(play) 继续';
		} else {
			pauseStatusBarItem.text = '$(debug-pause) 暂停';
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
		vscode.window.showErrorMessage('没有选择要输入的内容');
		return;
	}
	
	try {
		state.startTyping();
		updateStatusBar();
		
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: state.currentTemplate 
				? `正在以${state.currentSpeed.name}速度输入模板 ${state.currentTemplate}...`
				: `正在以${state.currentSpeed.name}速度输入代码...`,
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
		vscode.window.showErrorMessage(`输入失败: ${error}`);
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Code Typer 扩展已激活!');

	// 初始化状态栏元素
	templateStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	templateStatusBarItem.command = 'code-typer.selectTemplate';
	templateStatusBarItem.tooltip = '选择模板文件';
	
	effectsStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 101);
	effectsStatusBarItem.command = 'code-typer.toggleEffects';
	effectsStatusBarItem.tooltip = '切换输入特效';
	
	playStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
	playStatusBarItem.command = 'code-typer.play';
	playStatusBarItem.text = '$(play) 播放';
	playStatusBarItem.tooltip = '开始输入';
	
	pauseStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 98);
	pauseStatusBarItem.command = 'code-typer.pause';
	pauseStatusBarItem.tooltip = '暂停/继续输入';
	
	stopStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 97);
	stopStatusBarItem.command = 'code-typer.stop';
	stopStatusBarItem.text = '$(debug-stop) 停止';
	stopStatusBarItem.tooltip = '停止输入';

	// 初始状态栏显示
	updateStatusBar();

	// 切换特效命令
	const toggleEffectsCommand = vscode.commands.registerCommand('code-typer.toggleEffects', () => {
		state.effectsEnabled = !state.effectsEnabled;
		updateStatusBar();
		const status = state.effectsEnabled ? '开启' : '关闭';
		vscode.window.showInformationMessage(`输入特效已${status}`);
	});

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
					state.currentSpeed = TYPING_SPEEDS.normal;
					updateStatusBar();
					vscode.window.showInformationMessage(`已选择模板: ${templateFile}`);
				}
			}
		} catch (error) {
			vscode.window.showErrorMessage(`选择模板失败: ${error}`);
		}
	});

	// 播放命令
	const playCommand = vscode.commands.registerCommand('code-typer.play', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('请先打开一个文件');
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
			vscode.window.showErrorMessage('请先打开一个文件');
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
			vscode.window.showErrorMessage(`输入失败: ${error}`);
		}
	});

	// 慢速输入命令
	const typeCodeSlowlyCommand = vscode.commands.registerCommand('code-typer.typeCodeSlowly', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('请先打开一个文件');
			return;
		}

		try {
			const result = await getCodeSnippet();
			if (!result) {
				return;
			}

			state.currentContent = result.content;
			state.currentTemplate = result.isTemplate && result.templateName ? result.templateName : '';
			state.currentSpeed = TYPING_SPEEDS.slow;
			updateStatusBar();

			await executeTyping(editor);

		} catch (error) {
			vscode.window.showErrorMessage(`输入失败: ${error}`);
		}
	});

	// 快速输入命令
	const typeCodeFastCommand = vscode.commands.registerCommand('code-typer.typeCodeFast', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('请先打开一个文件');
			return;
		}

		try {
			const result = await getCodeSnippet();
			if (!result) {
				return;
			}

			state.currentContent = result.content;
			state.currentTemplate = result.isTemplate && result.templateName ? result.templateName : '';
			state.currentSpeed = TYPING_SPEEDS.fast;
			updateStatusBar();

			await executeTyping(editor);

		} catch (error) {
			vscode.window.showErrorMessage(`输入失败: ${error}`);
		}
	});

	// 从模板文件输入命令
	const typeFromTemplateCommand = vscode.commands.registerCommand('code-typer.typeFromTemplate', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('请先打开一个文件');
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
			vscode.window.showErrorMessage(`从模板输入失败: ${error}`);
		}
	});

	// 注册所有命令和状态栏元素
	context.subscriptions.push(
		typeCodeCommand,
		typeCodeSlowlyCommand, 
		typeCodeFastCommand,
		typeFromTemplateCommand,
		selectTemplateCommand,
		toggleEffectsCommand,
		playCommand,
		pauseCommand,
		stopCommand,
		templateStatusBarItem,
		effectsStatusBarItem,
		playStatusBarItem,
		pauseStatusBarItem,
		stopStatusBarItem
	);
}

// This method is called when your extension is deactivated
export function deactivate() {
	state.reset();
}
