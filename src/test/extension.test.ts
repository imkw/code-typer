import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('karlwang.code-typer'));
	});

	test('Should register all commands', async () => {
		const commands = await vscode.commands.getCommands(true);
		const expectedCommands = [
			'code-typer.typeCode',
			'code-typer.typeCodeSlowly',
			'code-typer.typeCodeFast',
			'code-typer.typeFromTemplate',
			'code-typer.selectTemplate',
			'code-typer.play',
			'code-typer.pause',
			'code-typer.stop'
		];
		
		for (const command of expectedCommands) {
			assert.ok(commands.includes(command), `Command ${command} should be registered`);
		}
	});

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
});
