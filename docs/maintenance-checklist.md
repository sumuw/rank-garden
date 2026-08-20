# rank-garden 项目维护清单

## 1. 项目基础信息

- 仓库：`https://github.com/sumuw/rank-garden`
- 线上地址：`https://sumuw.github.io/rank-garden/`
- 本地目录：当前仍在 `D:\work\workspace\codex\my`
- 默认分支：`main`
- 站点框架：Astro
- 发布方式：GitHub Pages + GitHub Actions
- 内容结构：Markdown 负责文章解读，JSON 负责榜单事实数据

## 2. 日常维护流程

每次修改内容或页面后，按顺序执行：

```bash
npm run validate:rankings
npm run build
git status --short
git add <changed-files>
git commit -m "chore: update rankings"
git push origin main
```

推送后检查：

```text
https://github.com/sumuw/rank-garden/actions
https://sumuw.github.io/rank-garden/
```

## 3. 新增每日 GitHub 榜单

推荐文件：

```text
data/rankings/github/daily/YYYY-MM-DD.json
src/content/rankings/github-daily-YYYY-MM-DD.md
```

JSON 必须包含：

```json
{
  "category": "github",
  "period": "daily",
  "date": "YYYY-MM-DD",
  "source": "github-trending",
  "sourceUrl": "https://github.com/trending?since=daily",
  "items": []
}
```

Markdown frontmatter 必须包含：

```md
---
title: "GitHub 每日趋势榜 YYYY-MM-DD"
description: "一句摘要"
category: "github"
period: "daily"
date: "YYYY-MM-DD"
dataFile: "data/rankings/github/daily/YYYY-MM-DD.json"
tags: ["GitHub", "开源", "趋势"]
---
```

新增后必须运行：

```bash
npm run validate:rankings
npm run build
```

## 4. 导入 WorkBuddy 历史榜单

当前已有导入脚本：

```bash
node scripts/import-workbuddy-rankings.mjs D:\cache\WorkBuddy\automation-2026-08-07-14-48-13
```

导入后检查：

```bash
npm run validate:rankings
npm run build
```

如果导入后标签被拆散、字段为空，优先检查源 Markdown 是否仍保持这些格式：

```md
## 1. owner / repo
### 1. owner/repo
- **项目地址**：
- **主要语言**：
- **今日新增 Star**：
- **简介**：
**标签**：
**评论**：
```

## 5. 线上 404 排查

常见原因：项目站路径缺少 `/rank-garden/`。

正确链接应该类似：

```text
https://sumuw.github.io/rank-garden/rankings/github-daily-2026-08-19/
```

错误链接通常是：

```text
https://sumuw.github.io/rankings/github-daily-2026-08-19/
```

本地排查：

```powershell
$env:BASE_PATH='/rank-garden/'
npm run build
Select-String -Path dist\index.html -Pattern 'href="[^"]+"' -AllMatches
```

判断标准：

- 详情链接应包含：`/rank-garden/rankings/`
- 分类链接应包含：`/rank-garden/categories/`
- 不应出现：`href="/rankings/`

## 6. GitHub Pages 不更新

排查顺序：

1. 查看是否推送成功：

```bash
git log -3 --oneline
git status --short
```

2. 查看 Actions：

```text
https://github.com/sumuw/rank-garden/actions
```

3. 查看 Pages 设置：

```text
Settings -> Pages -> Source -> GitHub Actions
```

4. 查看 Actions Variables：

```text
SITE_URL=https://sumuw.github.io
BASE_PATH=/rank-garden/
```

5. 等待 30 到 90 秒后强制刷新浏览器。

## 7. 构建失败排查

先运行：

```bash
npm run validate:rankings
npm run build
```

### 7.1 内容校验失败

常见报错：

```text
dataFile does not exist
category mismatch
period mismatch
date mismatch
rank must be N
tags must have at most 5 items
```

处理方式：

- 检查 Markdown 的 `dataFile` 路径是否存在。
- 检查 JSON 和 Markdown 的 `category`、`period`、`date` 是否一致。
- 检查 JSON 中 `items[].rank` 是否从 1 连续递增。
- 检查每个项目是否有 `name`、`url`、`description`。
- 检查 `tags` 是否最多 5 个。

### 7.2 Astro check 失败

处理顺序：

```bash
node --version
npm --version
npm install
npm run build
```

当前建议 Node 版本：

```text
Node 22.x
```

### 7.3 Astro telemetry 权限失败

如果看到：

```text
EPERM: operation not permitted, mkdir AppData\Roaming\astro\Config
```

不要直接用 `npx astro`。使用项目脚本：

```bash
npm run build
npm run dev
node scripts/astro.mjs dev status
```

项目里的 `scripts/astro.mjs` 已默认禁用 Astro telemetry。

### 7.4 Windows 原生依赖缺失

如果看到类似：

```text
Cannot find native binding
satteri_napi.win32-x64-msvc.node
```

处理：

```bash
npm install
npm run build
```

项目已配置 `@astrojs/markdown-remark`，正常情况下不会依赖 Satteri 原生 Markdown 绑定。

## 8. 本地开发服务

启动：

```bash
npm run dev -- --host 127.0.0.1 --port 4321
```

查看状态：

```bash
node scripts/astro.mjs dev status
```

停止：

```bash
node scripts/astro.mjs dev stop
```

如果目录重命名失败，先确认 dev server 已停止。

## 9. Git 推送失败

先检查远程：

```bash
git remote -v
```

再推送：

```bash
git push origin main
```

如果 GitHub 凭据失效，重新登录 GitHub Desktop、Git Credential Manager，或改用 SSH remote。

## 10. 页面样式维护

主要文件：

```text
src/pages/index.astro
src/pages/categories/[category].astro
src/pages/rankings/[slug].astro
src/components/RankingTable.astro
src/layouts/BaseLayout.astro
```

修改样式后至少检查：

- 首页分类是否在上部。
- 首页榜单是否是列表。
- 榜单是否按时间倒序。
- “更多”按钮是否跳转到分类页。
- 移动端宽度下内容不溢出。

验证：

```bash
npm run build
```

## 11. 发布前人工检查清单

- [ ] `npm run validate:rankings` 通过。
- [ ] `npm run build` 通过。
- [ ] `BASE_PATH=/rank-garden/ npm run build` 通过。
- [ ] 首页链接包含 `/rank-garden/`。
- [ ] 新增 Markdown 和 JSON 成对存在。
- [ ] `git status --short` 只包含本次预期变更。
- [ ] 提交信息说明了本次变更。
- [ ] `git push origin main` 成功。
- [ ] GitHub Actions 部署成功。
- [ ] 线上首页和至少一个详情页可访问。

## 12. 快速定位命令

查看最近榜单文件：

```powershell
Get-ChildItem data\rankings\github\daily | Sort-Object Name -Descending | Select-Object -First 10
Get-ChildItem src\content\rankings | Sort-Object Name -Descending | Select-Object -First 10
```

检查首页链接：

```powershell
Select-String -Path dist\index.html -Pattern 'href="[^"]+"' -AllMatches
```

检查某天详情页是否生成：

```powershell
Test-Path dist\rankings\github-daily-YYYY-MM-DD\index.html
```

线上检查：

```powershell
Invoke-WebRequest -Uri https://sumuw.github.io/rank-garden/ -UseBasicParsing
Invoke-WebRequest -Uri https://sumuw.github.io/rank-garden/rankings/github-daily-YYYY-MM-DD/ -UseBasicParsing
```

