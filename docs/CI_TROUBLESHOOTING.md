# GitHub Actions 故障排除指南

## 最新修复的问题

### 1. vsce 包版本兼容性问题
**错误**: `ReferenceError: File is not defined` 在 Node.js 18 环境中

**原因**: 最新版本的 `@vscode/vsce` 与 Node.js 18 不兼容

**修复**: 
- 升级到 Node.js 20
- 固定 vsce 版本为 `@vscode/vsce@2.22.0`
- 使用 `--no-dependencies` 而不是 `--allow-missing-repository`

### 2. Artifact 上传失效问题
**错误**: 工作流中 artifact 没有正确上传

**原因**: 
- 使用了重复的 artifact 名称
- Matrix 策略条件不当

**修复**:
- 使用唯一的 artifact 名称: `extension-build-${{ github.run_number }}`
- 简化 matrix 策略，只使用 Node.js 20

### 3. 发布动作未触发问题
**错误**: 推送标签后没有触发发布工作流

**原因**: 标签格式或推送方式问题

**修复**:
- 确保标签格式为 `v*` (如 `v1.0.2`)
- 使用正确的推送命令: `git push --tags`
- 改进发布脚本的输出提示

## 当前稳定的配置

### 构建环境
```yaml
node-version: 20
vsce-version: 2.22.0
package-flags: --no-dependencies
```

### 发布流程
1. 使用发布脚本: `./scripts/release.sh patch`
2. 推送更改: `git push && git push --tags`
3. 自动触发 GitHub Actions

## 快速发布

使用新的快速发布脚本：
```bash
./scripts/quick-release.sh
```

这会自动：
- 提交当前更改
- 创建补丁版本
- 推送到 GitHub
- 触发自动发布

## 当前 CI 流程

### Build Workflow (`.github/workflows/build.yml`)
1. ✅ 检出代码
2. ✅ 设置 Node.js 环境
3. ✅ 安装依赖
4. ✅ 类型检查
5. ✅ 代码检查 (lint)
6. ✅ 编译扩展
7. ✅ 打包扩展
8. ✅ 上传构建产物

### Release Workflow (`.github/workflows/release.yml`)
1. ✅ 检出代码
2. ✅ 设置 Node.js 环境
3. ✅ 安装依赖
4. ✅ 编译扩展
5. ✅ 打包扩展
6. ✅ 创建 GitHub Release
7. ✅ 上传 .vsix 文件

## 本地测试

如果需要在本地运行测试：

```bash
# 编译测试文件
npm run compile-tests

# 运行测试（需要 VS Code 环境）
npm test
```

## 验证构建

使用提供的脚本验证完整构建流程：

```bash
./scripts/verify-build.sh
```

## 常见问题

### Q: 如何重新启用测试？
A: 如果想要在 CI 中运行测试，需要：
1. 安装 xvfb 用于虚拟显示
2. 配置适当的环境变量
3. 确保测试不依赖于交互式操作

### Q: 为什么使用 `--allow-missing-repository`？
A: 这是一个安全标志，允许在某些仓库配置问题时仍能成功打包。

### Q: 如何添加新的构建步骤？
A: 在 `.github/workflows/` 目录中编辑相应的 YAML 文件，添加新的步骤。

## 监控构建状态

- 构建状态徽章已添加到 README.md
- 可以在 GitHub Actions 页面查看详细日志
- 失败时会收到邮件通知（如果启用）