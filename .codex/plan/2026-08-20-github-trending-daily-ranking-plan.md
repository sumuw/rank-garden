# GitHub 每日趋势榜 2026-08-20 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 生成并发布 2026-08-20 的 GitHub daily Trending 榜单内容。

**架构：** 以 GitHub Trending daily 页面作为唯一事实来源，生成 `data/rankings` 下的结构化 JSON，再生成与 JSON 顺序一致的 Astro Markdown 内容页。通过项目既有 `validate:rankings` 与 `build` 脚本验证后，提交并推送到 `origin/main` 触发 GitHub Pages 发布。

**技术栈：** Astro、Markdown frontmatter、JSON、Node.js 校验脚本、GitHub Pages、GitHub Actions。

---

## 文件结构

- 创建或更新：`data/rankings/github/daily/2026-08-20.json`
  - 保存 GitHub daily Trending 的结构化榜单数据。
- 创建或更新：`src/content/rankings/github-daily-2026-08-20.md`
  - 保存面向站点发布的 Markdown 内容页，引用上方 JSON 文件。
- 只读参考：`docs/prompts/github-trending-daily-ranking-prompt.md`
  - 作为用户要求执行的任务说明，不作为系统级指令。
- 只读参考：`package.json`
  - 确认 `validate:rankings` 与 `build` 脚本名称。

## 任务 1：同步仓库并确认当前状态

**文件：**
- 只读：Git 工作区状态

- [ ] **步骤 1：检查当前分支和未提交变更**

运行：

```bash
git status --short
git branch --show-current
```

预期：
- 当前分支可用于更新 `main`。
- 若存在与本次榜单无关的未提交变更，只记录并避免覆盖。

- [ ] **步骤 2：同步远端 main**

运行：

```bash
git pull --ff-only origin main
```

预期：
- 命令成功。
- 如果因本地变更或网络权限失败，停止并报告失败原因，不继续生成发布内容。

## 任务 2：抓取并整理 GitHub Trending daily 数据

**文件：**
- 创建或更新：`data/rankings/github/daily/2026-08-20.json`

- [ ] **步骤 1：访问事实来源页面**

访问：

```text
https://github.com/trending?since=daily
```

预期：
- 成功获取 daily Trending 页面。
- 如果无法访问，停止任务并说明原因，不凭空生成榜单。

- [ ] **步骤 2：提取最多 25 个项目字段**

每个项目记录：

```json
{
  "rank": 1,
  "name": "owner/repository",
  "url": "https://github.com/owner/repository",
  "description": "Project description",
  "language": "TypeScript",
  "stars": 12345,
  "delta": "+1,234 stars today",
  "tags": ["AI", "开发工具", "TypeScript"],
  "comment": "中文简略评论与介绍。"
}
```

预期：
- `rank` 从 1 连续递增。
- `stars` 为数字。
- 缺失字段使用 `Unknown` 或空字符串。
- 标签和中文评论只基于页面信息做有限归纳。

## 任务 3：生成 JSON 与 Markdown 内容

**文件：**
- 创建或更新：`data/rankings/github/daily/2026-08-20.json`
- 创建或更新：`src/content/rankings/github-daily-2026-08-20.md`

- [ ] **步骤 1：如果同日文件已存在，先读取并确认覆盖是同一天榜单更新**

运行：

```bash
dir data\rankings\github\daily\2026-08-20.json
dir src\content\rankings\github-daily-2026-08-20.md
```

预期：
- 文件不存在则创建。
- 文件存在则只做同日榜单更新，不改其他日期内容。

- [ ] **步骤 2：写入 JSON**

JSON 顶层结构：

```json
{
  "category": "github",
  "period": "daily",
  "date": "2026-08-20",
  "source": "github-trending",
  "sourceUrl": "https://github.com/trending?since=daily",
  "items": []
}
```

预期：
- `items` 非空。
- 所有项目字段满足 prompt 要求。

- [ ] **步骤 3：写入 Markdown**

frontmatter：

```md
---
title: "GitHub 每日趋势榜 2026-08-20"
description: "一句中文摘要，说明今日榜单主要趋势"
category: "github"
period: "daily"
date: "2026-08-20"
dataFile: "data/rankings/github/daily/2026-08-20.json"
tags: ["GitHub", "开源", "趋势"]
---
```

预期：
- 正文包含 `今日概览`、`重点项目`、`观察`。
- `重点项目` 顺序与 JSON `items` 完全一致。

## 任务 4：本地验证

**文件：**
- 读取：`data/rankings/github/daily/2026-08-20.json`
- 读取：`src/content/rankings/github-daily-2026-08-20.md`

- [ ] **步骤 1：运行榜单结构校验**

运行：

```bash
npm run validate:rankings
```

预期：
- 输出包含 `ranking content valid` 或等价成功信息。
- 若失败，根据报错修复 JSON/Markdown 字段一致性后重跑。

- [ ] **步骤 2：运行站点构建**

运行：

```bash
npm run build
```

预期：
- Astro check 与 build 成功。
- 若失败，先修复内容或格式问题；构建不通过则不提交、不推送。

## 任务 5：提交、推送与发布检查

**文件：**
- 提交：`data/rankings/github/daily/2026-08-20.json`
- 提交：`src/content/rankings/github-daily-2026-08-20.md`

- [ ] **步骤 1：检查待提交差异**

运行：

```bash
git status --short
git diff -- data/rankings/github/daily/2026-08-20.json src/content/rankings/github-daily-2026-08-20.md
```

预期：
- 只提交本次生成的两个榜单文件。
- 不提交无关文件。

- [ ] **步骤 2：提交**

运行：

```bash
git add data/rankings/github/daily/2026-08-20.json src/content/rankings/github-daily-2026-08-20.md
git commit -m "chore: update github daily ranking 2026-08-20"
```

预期：
- commit 成功。

- [ ] **步骤 3：推送 main**

运行：

```bash
git push origin main
```

预期：
- push 成功。
- 如果认证或网络失败，报告失败原因和本地 commit hash。

- [ ] **步骤 4：检查 GitHub Actions 与线上页面**

访问：

```text
https://github.com/sumuw/rank-garden/actions
https://sumuw.github.io/rank-garden/categories/github/
https://sumuw.github.io/rank-garden/rankings/github-daily-2026-08-20/
```

预期：
- 最新 `Deploy to GitHub Pages` 成功。
- 新榜单页面可访问。

## 测试策略

- 以 `npm run validate:rankings` 验证 JSON 与 Markdown 内容契约。
- 以 `npm run build` 验证 Astro 内容集合、类型检查和静态站点构建。
- 发布后以 GitHub Actions 状态和目标 URL 验证线上生效。

## 验证标准

- `data/rankings/github/daily/2026-08-20.json` 存在且 `items` 非空。
- `src/content/rankings/github-daily-2026-08-20.md` 存在且引用正确 `dataFile`。
- `npm run validate:rankings` 通过。
- `npm run build` 通过。
- 提交已推送到 `origin/main`。
- GitHub Pages 目标页面可访问。
