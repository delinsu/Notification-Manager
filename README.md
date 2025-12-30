# 📅 Subscription Manager (Serverless)

一个基于 GitHub Pages 和 GitHub Actions 的极简订阅管理工具。
**数据完全私有**，存储在你自己的 GitHub 仓库中，无需后台服务器。

![UI Preview](https://via.placeholder.com/800x400?text=Clean+UI+Preview)

## ✨ 特性

- **极简设计**: 现代化的 Clean Tech 风格 UI，支持深色模式。
- **Serverless**: 纯静态页面，利用 GitHub API 读写数据。
- **自动推送**: 每天早上 9 点通过 Bark App 推送即将到期的订阅。
- **多币种**: 支持 CNY, USD, HKD, JPY 等多种货币符号显示。

## 🚀 快速部署

### 1. Fork 本仓库
点击右上角的 **Fork** 按钮，将此仓库复制到你自己的账号下。

### 2. 获取 GitHub Token
为了让网页能保存数据，你需要一个 Token：
1. 访问 [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens).
2. 点击 **Generate new token (classic)**.
3. 勾选 `repo` 权限 (Full control of private repositories)。
4. **复制生成的 Token** (只会显示一次)。

### 3. 配置 GitHub Actions (用于推送)
为了让每日提醒功能生效：
1. 进入你 Fork 后的仓库 -> **Settings** -> **Secrets and variables** -> **Actions**.
2. 点击 **New repository secret**.
3. Name 填: `BARK_KEY`.
4. Value 填: 你的 Bark 服务器 URL 后面的 Key (例如 `https://bark-server.com/你的Key/` 中的 `你的Key`)。

### 4. 开启 GitHub Pages
1. 进入仓库 **Settings** -> **Pages**.
2. 在 **Build and deployment** 下，Source 选择 `Deploy from a branch`.
3. Branch 选择 `main` (或 `master`)，文件夹选择 `/(root)`.
4. 保存后，等待几分钟，你会获得一个访问链接。

## 📱 使用指南

1. 打开 GitHub Pages 生成的链接。
2. 点击右上角的 **设置图标**。
3. 在侧边栏填入：
   - **GitHub Token**: 第2步生成的 Token。
   - **用户名**: 你的 GitHub 账号名。
   - **仓库名**: 你 Fork 的仓库名称。
   - **文件路径**: 默认 `subscriptions.json` 即可。
4. 输入完毕后点击任意空白处，系统会自动同步。
5. 点击右下角 `+` 号添加你的第一个订阅！

## 🔔 推送测试
如果你想立即测试推送功能：
1. 去仓库的 **Actions** 页面。
2. 点击左侧的 **Check Subscriptions**。
3. 点击右侧的 **Run workflow** 按钮。
4. 几秒钟后，你的手机应该会收到 Bark 推送。

---
*Created by Vue 3, Tailwind CSS & DaisyUI.*
