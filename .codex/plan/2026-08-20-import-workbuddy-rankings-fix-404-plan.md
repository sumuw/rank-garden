# 导入 WorkBuddy 榜单并修复详情 404 实现计划

## 目标

将 `D:\cache\WorkBuddy\automation-2026-08-07-14-48-13` 下已有的 GitHub 日榜 Markdown 维护进 `rank-garden` 项目，并修复线上项目站点击榜单详情 404 的问题。

## 范围

- 导入 8 篇历史 GitHub 日榜：2026-08-07、2026-08-08、2026-08-09、2026-08-11、2026-08-12、2026-08-13、2026-08-18、2026-08-19。
- 从原 Markdown 解析项目名称、地址、简介、主要语言、每日新增 star、总 star、标签、简评。
- 生成项目现有格式需要的 JSON：`data/rankings/github/daily/<date>.json`。
- 生成 Astro 内容集合 Markdown：`src/content/rankings/github-daily-<date>.md`。
- 扩展榜单详情表格，展示项目标签和简评。
- 修复项目站详情链接 404。
- 不改 GitHub Actions 发布流程本身，除非构建验证证明必须调整。

## 根因调查结论

- 外部目录中已有 `github-daily-trending-YYYY-MM-DD.md` 文件，结构稳定，包含 `### N. owner/repo`、项目地址、主要语言、今日新增、总 star、简介、标签、简评。
- 当前 `dist/index.html` 中详情链接形如 `/rankings/github-daily-2026-08-20/`。
- 对项目站 `https://sumuw.github.io/rank-garden/` 来说，如果线上构建没有正确带上 `/rank-garden/` base，点击会跳到 `https://sumuw.github.io/rankings/...`，从而 404。
- 当前链接生成集中在 `src/lib/rankings.ts` 的 `getPostUrl()` 和 `getCategoryUrl()`，可集中修复。

## 技术方案

1. 新增导入脚本 `scripts/import-workbuddy-rankings.mjs`，把 WorkBuddy Markdown 转换为项目标准 JSON + Markdown。
2. 扩展 `RankingItem` 类型和 `RankingTable.astro`，支持 `tags?: string[]` 与 `comment?: string`。
3. 增强 `scripts/validate-rankings.mjs`，校验 `tags` 最多 5 个、`comment` 类型合法、`stars` 为数字。
4. 修复 URL 生成：使用一个稳定的 `withBasePath()` 辅助函数，确保项目站所有内部链接带 `/rank-garden/`。
5. 用 `BASE_PATH=/rank-garden/ npm run build` 验证构建产物中的首页、分类页、详情页链接都带正确前缀。

## 拆分步骤

1. 创建导入脚本，先解析 1 篇 `2026-08-19`，生成 JSON/Markdown。
2. 跑 `npm run validate:rankings`，根据失败信息补齐 schema/校验规则。
3. 扩展表格 UI，展示标签和简评。
4. 导入全部 8 篇历史日榜。
5. 修复链接 base path，验证本地 `BASE_PATH=/rank-garden/` 构建产物。
6. 跑完整验证并提交：
   - `npm run validate:rankings`
   - `npm run build`
   - `BASE_PATH=/rank-garden/ npm run build`
7. 推送到 `origin/main` 后检查 GitHub Pages 发布。

## 测试策略

- 解析脚本先用一篇文件验证，再全量导入。
- 内容校验覆盖 Markdown frontmatter 与 JSON 的 `category/period/date` 一致性。
- 校验 `rank` 连续、`items` 非空、必需字段完整。
- 校验 `tags.length <= 5`。
- 校验项目站构建产物链接包含 `/rank-garden/`。

## 验证标准

- `data/rankings/github/daily/2026-08-07.json` 到 `2026-08-19.json` 中对应文件存在。
- `src/content/rankings/github-daily-2026-08-07.md` 到 `2026-08-19.md` 中对应文件存在。
- 首页最新榜单展示导入后的历史日榜。
- 分类页可以看到所有 GitHub 日榜。
- 详情页点击不再跳出 `/rank-garden/` 路径。
- `npm run validate:rankings` 通过。
- `npm run build` 通过。
- `BASE_PATH=/rank-garden/ npm run build` 通过，且 `dist/index.html` 中详情链接为 `/rank-garden/rankings/...`。

