# 排行榜博客项目实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 构建一个托管在 GitHub Pages 上的开源排行榜博客，支持 GitHub 日榜/周榜作为首批内容，并为影视榜单与其他榜单预留扩展点。

**架构：** 使用 Astro 作为静态站点框架，Markdown/MDX 保存 AI 解读内容，JSON 保存可复算的榜单事实数据。GitHub Actions 分别负责定时生成榜单内容与构建部署到 GitHub Pages。

**技术栈：** Astro、TypeScript、Markdown/MDX、JSON Schema/Zod、GitHub Actions、GitHub Pages、Node.js 22。

---

## 范围

- 首期实现：简洁排行榜内容站、分类页、榜单详情页、归档页、GitHub 日榜/周榜样例数据、GitHub Pages 部署工作流。
- 首期不实现：用户登录、后台 CMS、数据库、评论系统、付费功能、动态服务端 API。
- 内容原则：AI 负责摘要、趋势解读和标题建议；榜单排名、项目链接、星标数、语言、日期等事实字段必须来自结构化 JSON。

## 文件结构

- 创建：`.git/`，本地 Git 仓库，后续关联 GitHub 远程仓库。
- 创建：`package.json`，项目命令和依赖声明。
- 创建：`astro.config.mjs`，配置 Astro 静态站点、GitHub Pages base/site。
- 创建：`tsconfig.json`，TypeScript 基础配置。
- 创建：`src/content/config.ts`，定义排行榜 Markdown frontmatter schema。
- 创建：`src/content/rankings/*.md`，保存 AI 生成的榜单解读文章。
- 创建：`data/rankings/**/*.json`，保存榜单事实数据。
- 创建：`src/lib/rankings.ts`，读取、校验、聚合榜单内容和 JSON 数据。
- 创建：`src/layouts/BaseLayout.astro`，全站基础布局。
- 创建：`src/components/RankingTable.astro`，榜单表格组件。
- 创建：`src/pages/index.astro`，首页，展示最新榜单和分类入口。
- 创建：`src/pages/categories/[category].astro`，分类聚合页。
- 创建：`src/pages/rankings/[slug].astro`，榜单详情页。
- 创建：`scripts/validate-rankings.mjs`，本地和 CI 内容校验脚本。
- 创建：`scripts/generate-github-ranking.mjs`，GitHub 榜单生成脚本骨架。
- 创建：`.github/workflows/deploy.yml`，构建并部署到 GitHub Pages。
- 创建：`.github/workflows/generate-rankings.yml`，定时生成榜单内容。
- 创建：`README.md`，说明本地开发、内容格式、发布方式。

## 任务 0：确认 GitHub Pages 仓库形态

**文件：**
- 创建：本地 Git 仓库
- 创建：GitHub 远程仓库

- [ ] **步骤 1：选择发布地址类型**

二选一：

- 用户站：仓库名使用 `username.github.io`，访问地址为 `https://username.github.io/`，推荐用于主博客。
- 项目站：仓库名使用普通名称，例如 `rankings-blog`，访问地址为 `https://username.github.io/rankings-blog/`，推荐用于试验项目。

- [ ] **步骤 2：初始化本地仓库**

运行：

```bash
git init
git branch -M main
```

预期：当前目录成为 Git 仓库，默认分支为 `main`。

- [ ] **步骤 3：创建 GitHub 仓库并关联远程**

用户站示例：

```bash
git remote add origin git@github.com:username/username.github.io.git
```

项目站示例：

```bash
git remote add origin git@github.com:username/rankings-blog.git
```

- [ ] **步骤 4：记录部署变量**

用户站：

```text
SITE_URL=https://username.github.io
BASE_PATH=/
```

项目站：

```text
SITE_URL=https://username.github.io
BASE_PATH=/rankings-blog/
```

## 任务 1：初始化 Astro 静态站点骨架

**文件：**
- 创建：`package.json`
- 创建：`astro.config.mjs`
- 创建：`tsconfig.json`
- 创建：`src/layouts/BaseLayout.astro`
- 创建：`src/pages/index.astro`

- [ ] **步骤 1：创建最小项目配置**

`package.json` 包含以下命令：

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "validate:rankings": "node scripts/validate-rankings.mjs"
  },
  "dependencies": {
    "@astrojs/check": "latest",
    "astro": "latest",
    "typescript": "latest",
    "zod": "latest"
  },
  "devDependencies": {}
}
```

- [ ] **步骤 2：配置 Astro**

`astro.config.mjs` 使用可覆盖的部署变量，避免先绑定真实 GitHub 用户名：

```js
import { defineConfig } from "astro/config";

const site = process.env.SITE_URL || "https://example.github.io";
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  site,
  base
});
```

- [ ] **步骤 3：添加基础布局和首页**

首页先渲染站名、分类入口、最新榜单占位数据，保持简洁信息流样式。

- [ ] **步骤 4：运行首次构建**

运行：`npm install` 后 `npm run build`

预期：Astro check 通过，生成 `dist/`。

- [ ] **步骤 5：Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src
git commit -m "feat: initialize ranking blog site"
```

## 任务 2：建立排行榜内容模型

**文件：**
- 创建：`src/content/config.ts`
- 创建：`data/rankings/github/daily/2026-08-20.json`
- 创建：`src/content/rankings/github-daily-2026-08-20.md`
- 创建：`scripts/validate-rankings.mjs`

- [ ] **步骤 1：定义 Markdown frontmatter schema**

`src/content/config.ts` 定义字段：

```ts
import { defineCollection, z } from "astro:content";

const rankings = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["github", "movie", "tv", "ai", "other"]),
    period: z.enum(["daily", "weekly", "monthly"]),
    date: z.string(),
    dataFile: z.string(),
    tags: z.array(z.string()).default([])
  })
});

export const collections = { rankings };
```

- [ ] **步骤 2：定义 JSON 榜单事实格式**

样例 JSON：

```json
{
  "category": "github",
  "period": "daily",
  "date": "2026-08-20",
  "source": "github-trending",
  "items": [
    {
      "rank": 1,
      "name": "owner/repository",
      "url": "https://github.com/owner/repository",
      "description": "Project summary",
      "language": "TypeScript",
      "stars": 12345,
      "delta": "+321"
    }
  ]
}
```

- [ ] **步骤 3：添加 Markdown 样例文章**

样例 frontmatter：

```md
---
title: "GitHub 每日趋势榜 2026-08-20"
description: "AI 与开发者工具项目在今日 GitHub 趋势榜中表现突出。"
category: "github"
period: "daily"
date: "2026-08-20"
dataFile: "../../../data/rankings/github/daily/2026-08-20.json"
tags: ["GitHub", "开源", "AI"]
---

今天的 GitHub 趋势榜以开发者效率、AI 工具和基础设施项目为主。
```

- [ ] **步骤 4：实现内容校验脚本**

`scripts/validate-rankings.mjs` 校验：

- 每篇 Markdown 的 `dataFile` 指向存在的 JSON。
- JSON 的 `category`、`period`、`date` 与 Markdown frontmatter 一致。
- `items` 非空，`rank` 从 1 连续递增。
- 每个 item 必须有 `name`、`url`、`description`。

- [ ] **步骤 5：运行校验**

运行：`npm run validate:rankings`

预期：输出 `ranking content valid`，退出码为 0。

- [ ] **步骤 6：Commit**

```bash
git add src/content data scripts package.json package-lock.json
git commit -m "feat: add ranking content model"
```

## 任务 3：实现分类页与详情页

**文件：**
- 创建：`src/lib/rankings.ts`
- 创建：`src/components/RankingTable.astro`
- 修改：`src/pages/index.astro`
- 创建：`src/pages/categories/[category].astro`
- 创建：`src/pages/rankings/[slug].astro`

- [ ] **步骤 1：实现读取聚合函数**

`src/lib/rankings.ts` 暴露：

```ts
export type RankingCategory = "github" | "movie" | "tv" | "ai" | "other";
export type RankingPeriod = "daily" | "weekly" | "monthly";

export async function getAllRankingPosts() {
  const posts = await getCollection("rankings");
  return posts.sort((a, b) => b.data.date.localeCompare(a.data.date));
}

export async function getRankingPostsByCategory(category: RankingCategory) {
  const posts = await getAllRankingPosts();
  return posts.filter((post) => post.data.category === category);
}
```

- [ ] **步骤 2：实现榜单表格组件**

`RankingTable.astro` 接收 `items`，展示排名、名称、描述、语言、星标、变化值、外链。

- [ ] **步骤 3：实现首页**

首页展示：

- 最新 5 篇榜单。
- 分类入口：GitHub、影视、AI、其他。
- 每个入口显示最近更新时间。

- [ ] **步骤 4：实现分类页**

路由：`/categories/github/`

页面展示该分类下所有榜单，按日期倒序，支持日榜/周榜标签视觉区分。

- [ ] **步骤 5：实现详情页**

路由：`/rankings/github-daily-2026-08-20/`

页面展示标题、日期、分类、AI 解读正文和结构化榜单表格。

- [ ] **步骤 6：运行构建验证**

运行：`npm run build`

预期：`dist/index.html`、分类页、详情页均生成。

- [ ] **步骤 7：Commit**

```bash
git add src
git commit -m "feat: render ranking pages"
```

## 任务 4：配置 GitHub Pages 部署

**文件：**
- 创建：`.github/workflows/deploy.yml`
- 修改：`README.md`

- [ ] **步骤 1：创建部署工作流**

`.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v5
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run validate:rankings
      - run: npm run build
        env:
          SITE_URL: ${{ vars.SITE_URL }}
          BASE_PATH: ${{ vars.BASE_PATH || '/' }}
      - uses: actions/upload-pages-artifact@v4
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **步骤 2：README 写明 GitHub Pages 设置**

说明：

- GitHub 仓库 Settings -> Pages -> Source 选择 GitHub Actions。
- 用户站仓库名为 `username.github.io` 时，`BASE_PATH=/`。
- 项目站仓库名为普通仓库时，`BASE_PATH=/repo-name/`。
- GitHub 默认访问地址为 `https://username.github.io/` 或 `https://username.github.io/repo-name/`。

- [ ] **步骤 3：运行本地构建**

运行：`npm run validate:rankings && npm run build`

预期：校验和构建均通过。

- [ ] **步骤 4：Commit**

```bash
git add .github README.md
git commit -m "ci: deploy site to github pages"
```

## 任务 5：添加 GitHub 榜单生成工作流骨架

**文件：**
- 创建：`scripts/generate-github-ranking.mjs`
- 创建：`.github/workflows/generate-rankings.yml`
- 修改：`README.md`

- [ ] **步骤 1：生成脚本输入输出约定**

脚本参数：

```bash
node scripts/generate-github-ranking.mjs --period daily --date 2026-08-20
node scripts/generate-github-ranking.mjs --period weekly --date 2026-W34
```

输出：

- `data/rankings/github/<period>/<date>.json`
- `src/content/rankings/github-<period>-<date>.md`

- [ ] **步骤 2：实现首版脚本骨架**

首版脚本允许从静态示例数据生成文件，后续再接 GitHub Trending、GitHub Search API 或第三方数据源。

- [ ] **步骤 3：创建定时工作流**

`.github/workflows/generate-rankings.yml`：

```yaml
name: Generate rankings

on:
  schedule:
    - cron: "15 1 * * *"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  github-daily:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v5
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: node scripts/generate-github-ranking.mjs --period daily
      - run: npm run validate:rankings
      - uses: stefanzweifel/git-auto-commit-action@v6
        with:
          commit_message: "chore: update github daily ranking"
```

- [ ] **步骤 4：README 写明 AI 接入建议**

说明 AI 接入策略：

- 先抓取事实数据。
- 将事实数据传给 AI 生成摘要。
- AI 输出只写入 Markdown 正文和 `description`。
- JSON 事实数据不由 AI 自由编造。

- [ ] **步骤 5：运行脚本验证**

运行：`node scripts/generate-github-ranking.mjs --period daily`

预期：生成当天 GitHub 日榜 JSON 和 Markdown。

- [ ] **步骤 6：Commit**

```bash
git add scripts .github README.md data src/content
git commit -m "feat: add ranking generation workflow"
```

## 测试策略

- 内容校验：`npm run validate:rankings`
- 类型和 Astro 校验：`astro check`
- 静态构建：`npm run build`
- 本地预览：`npm run preview`
- GitHub 侧验证：Actions 中 `Generate rankings` 成功提交内容，`Deploy to GitHub Pages` 成功发布。

## 验证标准

- 首页可访问并展示最新榜单。
- `/categories/github/` 可访问并列出 GitHub 榜单。
- `/rankings/github-daily-2026-08-20/` 可访问并展示 AI 解读和榜单表格。
- `npm run validate:rankings` 能阻止 Markdown 与 JSON 不一致的内容。
- 推送到 `main` 后 GitHub Pages 自动部署。
- GitHub Pages 地址可通过 `https://username.github.io/` 或 `https://username.github.io/repo-name/` 访问。

## 自检结果

- 规格覆盖度：已覆盖选型、架构、分类、榜单详情、AI Markdown 生成、结构化数据、GitHub Pages、GitHub Actions。
- 占位符扫描：未保留待定项；GitHub 数据源作为后续可替换输入，首版以脚本骨架和样例数据保证可运行。
- 类型一致性：`category`、`period`、`date`、`dataFile` 在 Markdown schema、JSON 数据和页面聚合中保持一致。
