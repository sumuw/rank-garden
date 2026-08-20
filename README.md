# Ranking Blog

一个基于 Astro、Markdown 和结构化 JSON 的排行榜博客项目。首版使用 GitHub 榜单样例数据，后续可以扩展到影视榜单、AI 工具榜单和其他主题榜单。

## 本地开发

```bash
npm install
npm run dev
```

常用命令：

```bash
npm run validate:rankings
npm run build
npm run preview
npm run generate:github
```

## 内容结构

- `data/rankings/**/*.json`：保存榜单事实数据，例如排名、链接、语言、星标数。
- `src/content/rankings/*.md`：保存标题、描述、分类、日期和 AI 解读正文。
- `src/pages/categories/[category].astro`：分类页。
- `src/pages/rankings/[slug].astro`：榜单详情页。

Markdown 中的 `dataFile` 必须指向存在的 JSON 文件：

```md
---
title: "GitHub 每日趋势榜 2026-08-20"
description: "AI 与开发者工具项目在今日 GitHub 趋势榜中表现突出。"
category: "github"
period: "daily"
date: "2026-08-20"
dataFile: "data/rankings/github/daily/2026-08-20.json"
tags: ["GitHub", "开源", "AI"]
---
```

## AI 生成建议

推荐流程：

1. 先抓取可信事实数据并写入 JSON。
2. 把 JSON 传给 AI 生成摘要、标题建议和趋势解读。
3. AI 输出只写 Markdown 正文和描述。
4. `npm run validate:rankings` 校验 Markdown 与 JSON 是否一致。

不要让 AI 自由编造排名、星标数、链接或日期。

## GitHub Pages

在 GitHub 仓库中进入 `Settings -> Pages`，将 Source 设置为 `GitHub Actions`。

用户站推荐：

```text
仓库名：username.github.io
SITE_URL=https://username.github.io
BASE_PATH=/
访问地址：https://username.github.io/
```

项目站推荐：

```text
仓库名：ranking-blog
SITE_URL=https://username.github.io
BASE_PATH=/ranking-blog/
访问地址：https://username.github.io/ranking-blog/
```

`SITE_URL` 和 `BASE_PATH` 可以在 GitHub 仓库的 `Settings -> Secrets and variables -> Actions -> Variables` 中配置。
