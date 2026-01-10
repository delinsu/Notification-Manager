# 🧾 Notification Manager

> **你的订阅，由你掌控。**
> 一个基于 GitHub API 的无后端、单文件订阅管理工具。
> 数据存储在你的私有仓库，安全、免费且永久属于你。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.0-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![No Backend](https://img.shields.io/badge/Serverless-100%25-blueviolet)]()

---

## ✨ 亮点功能 (Highlights)

Notification Manager 抛弃了臃肿的数据库和服务器，回归极简。

*   🎨 **Bento Grid UI**：采用网格布局，信息层级分明，视觉精美。
*   🔒 **隐私优先**：没有第三方服务器。所有数据直接通过 API 存入你自己的 GitHub 私有仓库 (`data.json`)。
*   ⚡ **零配置部署**：只有一个 `.html` 文件。无需 `npm install`，无需构建，双击即用，或托管在 GitHub Pages。
*   🌗 **深色模式**：自动适配系统，并在应用内丝滑切换日间/夜间模式。
*   💰 **多币种支持**：支持 CNY, USD, HKD, JPY 等，自动估算月度/年度总支出。
*   🚨 **到期提醒**：直观的进度条和颜色预警，告诉你下一个扣费日还有几天。
*   🌈 **智能色彩**：根据订阅名称自动生成高级的 Tint 风格品牌色背景。

---

## 📸 预览 (Screenshots)

| **Light Mode (日间模式)** | **Dark Mode (夜间模式)** |
|:---:|:---:|
| <img src="https://via.placeholder.com/400x800.png?text=Light+Mode+Preview" alt="Light Mode" width="100%"> | <img src="https://via.placeholder.com/400x800.png?text=Dark+Mode+Preview" alt="Dark Mode" width="100%"> |

> *注：实际界面采用响应式设计，完美适配 桌面端 和 移动端。*

---

## 🚀 快速开始 (Quick Start)

你不需要懂得编程，只需三步即可拥有自己的订阅管理器。

### 1. 准备 GitHub Token
由于数据存储在你的仓库中，你需要创建一个访问令牌（Token）：
1.  登录 GitHub，进入 [Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)。
2.  点击 **Generate new token (Classic)**。
3.  **Note** 任意填写。
4.  **Scopes** (权限) 勾选 `repo` (这允许读写你的私有仓库)。
5.  点击生成并**复制 Token** (以 `ghp_` 开头)。

### 2. 准备仓库
1.  创建一个新的 GitHub 仓库（建议设为 **Private** 私有，保护隐私）。
2.  记下你的用户名 (`Owner`) 和仓库名 (`Repo`)。

### 3. 运行与配置
1.  下载本项目的 `index.html` 文件。
2.  在浏览器中打开它（或部署到 GitHub Pages/Vercel）。
3.  点击右上角的 **设置 (⚙️)** 图标。
4.  填入你的：
    *   **Token**: `ghp_xxxx...`
    *   **Owner**: `你的用户名`
    *   **Repo**: `你的仓库名`
    *   **Path**: `data.json` (默认即可)
5.  保存！现在你可以点击右下角的 `+` 添加订阅了。

---

## 🛠️ 技术栈 (Tech Stack)

本项目展示了现代前端技术在“无构建流程”下的强大能力。

*   **Core**: [Vue.js 3](https://vuejs.org/) (Composition API, CDN引入)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (CDN Script)
*   **Components**: [DaisyUI](https://daisyui.com/) (部分交互组件)


---

## ❓ 常见问题 (FAQ)

**Q: 数据存在哪里？安全吗？**
A: 数据存储在你配置的 GitHub 仓库中的 `data.json` 文件里。如果你将仓库设为 **Private (私有)**，那么除了你之外没人能看到。本应用纯前端运行，Token 仅保存在你浏览器的 LocalStorage 中，不会发送给任何第三方服务器。

**Q: 为什么打开是白屏？**
A: 请检查浏览器控制台 (F12)。通常是因为网络无法连接到 GitHub API（国内网络环境可能需要科学上网），或者 Token 配置错误。

**Q: 如何备份数据？**
A: 你的数据就在 GitHub 上！你随时可以去你的仓库查看、下载或回滚 `data.json` 的历史版本。

**Q: 状态显示出错？**
A: 可能是更新后缓存问题。打开浏览器控制台 (F12)，输入 `localStorage.clear();` 后回车。

---

## 🗺️ 路线图 (Roadmap)
计划在未来版本中加入更多功能，同时保持“单文件、零依赖”的极简特性。
### 📊 数据可视化
- [ ] **支出图表**: 引入图表库，展示“支出类别占比”饼图和“年度支出趋势”柱状图。
- [ ] **日历视图**: 在日历上直观展示每一笔扣费的具体日期。
### ⚡ 增强功能
- [ ] **日历订阅 (.ics)**: 一键导出 `.ics` 文件，将扣费日同步到 Google Calendar 或 Apple Calendar。
- [ ] **多汇率管理**: 支持手动设置汇率或通过免费 API 实时获取最新汇率。
### 📂 数据管理
- [ ] **数据导入/导出**: 支持导出为 CSV/Excel 格式，或从其他订阅管理软件导入数据。
- [ ] **标签/分类系统**: 允许为订阅添加自定义标签（如：#娱乐, #生产力, #实体商品）。
- [ ] **多配置文件**: 支持切换不同的数据源（例如：区分“个人账单”和“公司账单”）。
### 🌍 国际化
- [ ] **多语言支持 (i18n)**: 增加英文/日文等多语言界面的切换。

---



## 📄 License

MIT License © 2025 Notification Manager
