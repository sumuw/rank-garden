import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const sourceDir =
  process.argv[2] || "D:\\cache\\WorkBuddy\\automation-2026-08-07-14-48-13";
const root = process.cwd();
const dataRoot = path.join(root, "data", "rankings", "github", "daily");
const contentRoot = path.join(root, "src", "content", "rankings");

function normalizeRepoName(value) {
  return value.replace(/\s+\/\s+/g, "/").trim();
}

function parseNumber(value) {
  const normalized = String(value || "").replace(/[^\d]/g, "");
  return normalized ? Number(normalized) : undefined;
}

function stripMd(value) {
  return String(value || "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/^#+\s*/, "")
    .trim();
}

function extractDate(fileName, source) {
  const fromName = fileName.match(/(\d{4}-\d{2}-\d{2})/);
  if (fromName) return fromName[1];

  const fromHeading = source.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (fromHeading) {
    const [, year, month, day] = fromHeading;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  throw new Error(`${fileName}: cannot extract date`);
}

function getSectionValue(section, labels) {
  for (const label of labels) {
    const bullet = section.match(new RegExp(`- \\*\\*${label}\\*\\*[：:]\\s*([^\\n]+)`));
    if (bullet) return stripMd(bullet[1]);

    const bold = section.match(new RegExp(`\\*\\*${label}\\*\\*[：:]\\s*([^\\n]+)`));
    if (bold) return stripMd(bold[1]);

    const table = section.match(new RegExp(`\\| \\*\\*${label}\\*\\* \\| ([^|]+) \\|`));
    if (table) return stripMd(table[1]);
  }

  return "";
}

function parseTags(section) {
  const quotedTags = [...section.matchAll(/`#?([^`]+)`/g)]
    .map((match) => match[1].trim())
    .filter(Boolean);

  if (quotedTags.length) return quotedTags.slice(0, 5);

  const raw = getSectionValue(section, ["标签"]);
  if (!raw) return [];

  return raw
    .split(/\s+/)
    .map((tag) => tag.replace(/^#/, "").trim())
    .filter(Boolean)
    .slice(0, 5);
}

function splitProjectSections(source) {
  const sectionRegex = /^#{2,3}\s+(\d+)\.\s+(.+)$/gm;
  const matches = [...source.matchAll(sectionRegex)].filter((match) => {
    const name = match[2].trim();
    return !name.includes("今日") && !name.includes("总结") && !name.includes("观察");
  });

  return matches.map((match, index) => {
    const start = match.index;
    const end = matches[index + 1]?.index ?? source.length;
    return {
      rank: Number(match[1]),
      name: normalizeRepoName(match[2]),
      body: source.slice(start, end)
    };
  });
}

function parseSource(fileName, source) {
  const date = extractDate(fileName, source);
  const sections = splitProjectSections(source);

  const items = sections.map((section, index) => {
    const url = getSectionValue(section.body, ["项目地址"]);
    const name = section.name.includes("/") ? section.name : normalizeRepoName(url.replace("https://github.com/", ""));
    const description = getSectionValue(section.body, ["简介"]) || "No description";
    const language = getSectionValue(section.body, ["主要语言"]) || "Unknown";
    const dailyStars =
      getSectionValue(section.body, ["今日新增 Star", "今日新增 ⭐", "每日新增 Star"]);
    const totalStars = getSectionValue(section.body, ["总 ⭐", "总 Star", "总星标", "总星标数量"]);
    const comment = getSectionValue(section.body, ["评论", "简评"]);

    return {
      rank: index + 1,
      name,
      url,
      description,
      language,
      stars: parseNumber(totalStars),
      delta: dailyStars ? (dailyStars.startsWith("+") ? dailyStars : `+${dailyStars}`) : "",
      tags: parseTags(section.body),
      comment
    };
  });

  return {
    category: "github",
    period: "daily",
    date,
    source: "github-trending",
    sourceUrl: "https://github.com/trending?since=daily",
    items
  };
}

function createDescription(ranking) {
  const languages = new Map();
  for (const item of ranking.items) {
    languages.set(item.language, (languages.get(item.language) || 0) + 1);
  }

  const topLanguages = [...languages.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([language]) => language)
    .join("、");

  return `${ranking.date} GitHub Trending 共收录 ${ranking.items.length} 个项目，主要覆盖 ${topLanguages || "多个技术方向"}。`;
}

function createMarkdown(ranking) {
  const topItems = ranking.items.slice(0, 5);
  const body = topItems
    .map((item) => {
      const tags = item.tags.length ? item.tags.join("、") : "未标注";
      return `### ${item.rank}. ${item.name}

- 地址：${item.url}
- 简介：${item.description}
- 语言：${item.language}
- 今日新增：${item.delta || "-"}
- 标签：${tags}

${item.comment || "暂无评论。"}`;
    })
    .join("\n\n");

  const description = createDescription(ranking);

  return `---
title: "GitHub 每日趋势榜 ${ranking.date}"
description: "${description}"
category: "github"
period: "daily"
date: "${ranking.date}"
dataFile: "data/rankings/github/daily/${ranking.date}.json"
tags: ["GitHub", "开源", "趋势"]
---

## 今日概览

${description}

榜单事实数据保存在对应 JSON 文件中，页面下方表格展示完整排名、项目地址、语言、星标变化、标签和简评。

## 重点项目

${body}
`;
}

async function importRankings() {
  const entries = await readdir(sourceDir, { withFileTypes: true });
  const sourceFiles = entries
    .filter((entry) => entry.isFile() && /^github-daily-trending-\d{4}-\d{2}-\d{2}\.md$/.test(entry.name))
    .map((entry) => entry.name)
    .sort();

  if (sourceFiles.length === 0) {
    throw new Error(`no source ranking files found in ${sourceDir}`);
  }

  await mkdir(dataRoot, { recursive: true });
  await mkdir(contentRoot, { recursive: true });

  for (const fileName of sourceFiles) {
    const source = await readFile(path.join(sourceDir, fileName), "utf-8");
    const ranking = parseSource(fileName, source);

    if (ranking.items.length === 0) {
      throw new Error(`${fileName}: no ranking items parsed`);
    }

    const dataFile = path.join(dataRoot, `${ranking.date}.json`);
    const contentFile = path.join(contentRoot, `github-daily-${ranking.date}.md`);
    await writeFile(dataFile, `${JSON.stringify(ranking, null, 2)}\n`, "utf-8");
    await writeFile(contentFile, createMarkdown(ranking), "utf-8");
    console.log(`imported ${ranking.date}: ${ranking.items.length} items`);
  }
}

importRankings().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
