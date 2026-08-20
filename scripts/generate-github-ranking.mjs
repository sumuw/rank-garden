import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}

const period = args.get("--period") || "daily";
const date = args.get("--date") || new Date().toISOString().slice(0, 10);

if (!["daily", "weekly", "monthly"].includes(period)) {
  console.error("--period must be one of: daily, weekly, monthly");
  process.exit(1);
}

const root = process.cwd();
const dataDir = path.join(root, "data", "rankings", "github", period);
const contentDir = path.join(root, "src", "content", "rankings");
const dataFile = path.join(dataDir, `${date}.json`);
const contentFile = path.join(contentDir, `github-${period}-${date}.md`);
const relativeDataFile = path.relative(root, dataFile).replaceAll("\\", "/");

const ranking = {
  category: "github",
  period,
  date,
  source: "sample-generator",
  items: [
    {
      rank: 1,
      name: "openai/codex",
      url: "https://github.com/openai/codex",
      description: "Command-line coding agent focused on local development workflows.",
      language: "Rust",
      stars: 45200,
      delta: "+1280"
    },
    {
      rank: 2,
      name: "withastro/astro",
      url: "https://github.com/withastro/astro",
      description: "Web framework for content-driven websites with fast static output.",
      language: "TypeScript",
      stars: 53100,
      delta: "+740"
    },
    {
      rank: 3,
      name: "gohugoio/hugo",
      url: "https://github.com/gohugoio/hugo",
      description: "Fast static site generator with mature taxonomy support.",
      language: "Go",
      stars: 82400,
      delta: "+410"
    }
  ]
};

const titlePeriod = period === "daily" ? "每日" : period === "weekly" ? "每周" : "每月";
const markdown = `---
title: "GitHub ${titlePeriod}趋势榜 ${date}"
description: "由脚本生成的 GitHub ${titlePeriod}趋势榜样例内容。"
category: "github"
period: "${period}"
date: "${date}"
dataFile: "${relativeDataFile}"
tags: ["GitHub", "开源", "AI"]
---

这篇榜单由本地脚本生成。当前版本使用样例数据，后续可以替换为 GitHub Search API、GitHub Trending 抓取结果或其他可信数据源。

建议保持“JSON 保存事实、Markdown 保存 AI 解读”的边界：排名、链接、星标数和语言来自结构化数据；摘要、亮点和趋势判断由 AI 生成。
`;

await mkdir(dataDir, { recursive: true });
await mkdir(contentDir, { recursive: true });
await writeFile(dataFile, `${JSON.stringify(ranking, null, 2)}\n`, "utf-8");
await writeFile(contentFile, markdown, "utf-8");

console.log(`generated ${relativeDataFile}`);
console.log(`generated ${path.relative(root, contentFile).replaceAll("\\", "/")}`);
