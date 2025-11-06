# GitHub Actions 自动发布指南

本项目已配置 GitHub Actions 自动化构建和发布流程。

## 🚀 自动发布流程

### 触发条件
当您推送以 `v` 开头的标签时（如 `v1.0.0`），GitHub Actions 会自动：

1. 🔍 检出代码
2. 📦 安装依赖
3. 🧪 运行测试
4. 🔨 编译扩展
5. 📋 打包 VS Code 扩展
6. 🎉 创建 GitHub Release
7. 📎 上传 `.vsix` 文件到 Release

### 发布步骤

#### 方法 1: 使用发布脚本（推荐）

```bash
# 发布补丁版本 (1.0.0 -> 1.0.1)
./scripts/release.sh patch

# 发布次版本 (1.0.0 -> 1.1.0)
./scripts/release.sh minor

# 发布主版本 (1.0.0 -> 2.0.0)
./scripts/release.sh major
```

脚本会自动：
- 更新版本号
- 更新 CHANGELOG.md
- 创建提交和标签
- 提供下一步操作指导

然后执行：
```bash
git push
git push --tags
```

#### 方法 2: 手动发布

```bash
# 1. 更新版本号
npm version patch  # 或 minor、major

# 2. 创建标签
git tag v$(node -p "require('./package.json').version")

# 3. 推送代码和标签
git push
git push --tags
```

## 🔧 工作流配置

### Release 工作流 (`.github/workflows/release.yml`)
- **触发**: 推送 `v*` 标签
- **功能**: 自动构建、测试、打包和发布

### Build 工作流 (`.github/workflows/build.yml`)
- **触发**: 推送到主分支或 PR
- **功能**: 持续集成构建和测试

## 📋 发布检查清单

发布前请确保：

- [ ] 代码已经过测试和验证
- [ ] README.md 已更新
- [ ] CHANGELOG.md 记录了变更
- [ ] package.json 中的信息正确
- [ ] 所有必要的文件都已提交

## 🔨 本地测试

在发布前，建议本地测试扩展：

```bash
# 编译
npm run compile

# 打包
npm install -g @vscode/vsce
vsce package

# 测试生成的 .vsix 文件
code --install-extension *.vsix
```

## 📦 发布后

成功发布后：

1. 🎉 GitHub Release 会自动创建
2. 📎 `.vsix` 文件会附加到 Release
3. 🔗 用户可以下载并手动安装扩展

## 🛠️ 自定义配置

### 修改发布信息
编辑 `.github/workflows/release.yml` 中的 Release body 部分。

### 添加发布前检查
在工作流中添加更多测试步骤或质量检查。

### 配置自动发布到 VS Code Marketplace
如需发布到官方市场，需要：
1. 注册 Azure DevOps 账户
2. 获取 Personal Access Token
3. 在 GitHub Secrets 中添加 `VSCE_PAT`
4. 修改工作流添加 `vsce publish`

## 🆘 故障排除

### 构建失败
- 检查代码编译错误
- 确认所有依赖都已正确安装
- 查看 GitHub Actions 日志

### 标签推送失败
- 确认标签格式正确（以 `v` 开头）
- 检查权限设置
- 确认仓库名称和 URL 正确

### Release 创建失败
- 检查 `GITHUB_TOKEN` 权限
- 确认仓库设置允许创建 Release
- 验证工作流语法正确性

---

## 👨‍💻 作者

**Karl Wang** - [code@imkw.cn](mailto:code@imkw.cn)

Project Link: [https://github.com/imkw/code-typer](https://github.com/imkw/code-typer)