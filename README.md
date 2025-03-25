# Delete Repos

批量删除 GitHub/Gitee 仓库的 Chrome 扩展

<p align="center">中文 | <a href="./README.en.md">English</a></p>

<p align="center"><img src="./assets/screenshot.png" width="90%"/></p>

## ✨ 简介

`Delete Repos`是一个 Chrome 浏览器扩展，用于批量删除 GitHub 或 Gitee 平台上的仓库。它提供了直观的用户界面，让您可以轻松地选择和删除多个仓库。

## 🛠️ 功能特点

-   支持`GitHub`和`Gitee`平台
-   批量删除选定的仓库
-   美观直观的用户界面
-   安全的 Token 管理
-   支持仓库筛选和搜索
-   响应式设计，适配不同屏幕大小

### 手动安装

1. 下载本仓库的源代码
2. 打开 Chrome 浏览器，进入扩展管理页面：`chrome://extensions/`
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"，选择项目的`.output/chrome-mv3`目录

## 🌟 使用方法

1. 点击浏览器工具栏中的 Delete Repos 图标
2. 选择平台（GitHub 或 Gitee）
3. 输入对应平台的访问令牌（Token）
    - 对于 GitHub，可以在[这里](https://github.com/settings/tokens/new?scopes=delete_repo,project,repo&description=deleteRepos)创建
    - 对于 Gitee，可以在[这里](https://gitee.com/profile/personal_access_tokens/new)创建
4. 扩展将获取您的仓库列表，并显示可删除的仓库
5. 选择要删除的仓库，然后点击"删除选定仓库"按钮
6. 确认后，扩展将批量删除所选仓库

## ⚠️ 注意事项

-   删除前请确认要删除的仓库，因为删除的仓库**无法恢复**
-   确保您的 Token 具有删除仓库的权限
-   为了安全，Token 仅存储在您的浏览器本地，不会传输到其他地方

## 🔄 开发与构建

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建扩展
pnpm build
```

## 🙌 贡献

欢迎任何形式的贡献！如果您发现任何问题或有建议，请提交 Issue 或 Pull Request。
