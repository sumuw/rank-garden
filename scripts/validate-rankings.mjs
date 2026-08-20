import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const contentDir = path.join(root, "src", "content", "rankings");

function parseFrontmatter(source, filePath) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new Error(`${filePath}: missing frontmatter`);
  }

  const data = {};
  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf(":");
    if (separator === -1) {
      throw new Error(`${filePath}: invalid frontmatter line "${line}"`);
    }

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    data[key] = parseYamlValue(rawValue);
  }

  return data;
}

function parseYamlValue(rawValue) {
  if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
    const body = rawValue.slice(1, -1).trim();
    if (!body) return [];
    return body.split(",").map((value) => stripQuotes(value.trim()));
  }

  return stripQuotes(rawValue);
}

function stripQuotes(value) {
  return value.replace(/^["']|["']$/g, "");
}

async function listMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function assertRequiredFrontmatter(frontmatter, filePath) {
  for (const key of ["title", "description", "category", "period", "date", "dataFile"]) {
    if (!frontmatter[key]) {
      throw new Error(`${filePath}: missing required frontmatter "${key}"`);
    }
  }
}

function assertRankingData(frontmatter, ranking, filePath) {
  for (const key of ["category", "period", "date"]) {
    if (ranking[key] !== frontmatter[key]) {
      throw new Error(
        `${filePath}: ${key} mismatch, markdown=${frontmatter[key]}, json=${ranking[key]}`
      );
    }
  }

  if (!Array.isArray(ranking.items) || ranking.items.length === 0) {
    throw new Error(`${filePath}: ranking items must be a non-empty array`);
  }

  ranking.items.forEach((item, index) => {
    const expectedRank = index + 1;
    if (item.rank !== expectedRank) {
      throw new Error(`${filePath}: item ${index} rank must be ${expectedRank}`);
    }

    for (const key of ["name", "url", "description"]) {
      if (!item[key]) {
        throw new Error(`${filePath}: item rank ${item.rank} missing "${key}"`);
      }
    }
  });
}

async function validate() {
  const markdownFiles = await listMarkdownFiles(contentDir);
  if (markdownFiles.length === 0) {
    throw new Error("no ranking markdown files found");
  }

  for (const filePath of markdownFiles) {
    const source = await readFile(filePath, "utf-8");
    const frontmatter = parseFrontmatter(source, filePath);
    assertRequiredFrontmatter(frontmatter, filePath);

    const dataPath = path.resolve(root, frontmatter.dataFile);
    if (!existsSync(dataPath)) {
      throw new Error(`${filePath}: dataFile does not exist: ${frontmatter.dataFile}`);
    }

    const ranking = JSON.parse(await readFile(dataPath, "utf-8"));
    assertRankingData(frontmatter, ranking, filePath);
  }

  console.log(`ranking content valid (${markdownFiles.length} files)`);
}

validate().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
