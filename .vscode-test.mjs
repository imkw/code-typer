import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
	files: 'out/test/**/*.test.js',
	workspaceFolder: './test-fixtures',
	mocha: {
		ui: 'tdd',
		timeout: 20000
	},
	// 在 CI 环境中禁用 GUI
	...(process.env.CI && {
		launchArgs: ['--disable-extensions', '--disable-workspace-trust'],
		version: 'stable'
	})
});
