import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type RankingCategory = "github" | "movie" | "tv" | "ai" | "other";
export type RankingPeriod = "daily" | "weekly" | "monthly";

export interface RankingItem {
  rank: number;
  name: string;
  url: string;
  description: string;
  language?: string;
  stars?: number;
  delta?: string;
  tags?: string[];
  comment?: string;
}

export interface RankingData {
  category: RankingCategory;
  period: RankingPeriod;
  date: string;
  source: string;
  sourceUrl?: string;
  items: RankingItem[];
}

export const categoryLabels: Record<RankingCategory, string> = {
  github: "GitHub",
  movie: "影视",
  tv: "剧集",
  ai: "AI",
  other: "其他"
};

export const periodLabels: Record<RankingPeriod, string> = {
  daily: "日榜",
  weekly: "周榜",
  monthly: "月榜"
};

const baseUrl = import.meta.env.BASE_URL;

function getSortableDateValue(date: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Date.parse(`${date}T00:00:00Z`);
  }

  const weekMatch = date.match(/^(\d{4})-W(\d{2})$/);
  if (weekMatch) {
    const year = Number(weekMatch[1]);
    const week = Number(weekMatch[2]);
    const jan4 = new Date(Date.UTC(year, 0, 4));
    const jan4Day = jan4.getUTCDay() || 7;
    const weekOneMonday = Date.UTC(year, 0, 4 - jan4Day + 1);
    return weekOneMonday + (week - 1) * 7 * 24 * 60 * 60 * 1000;
  }

  return Date.parse(date) || 0;
}

function withBasePath(pathname: string) {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const path = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  return `${base}${path}`;
}

export async function getAllRankingPosts() {
  const posts = await getCollection("rankings");
  return posts.sort((a, b) => getSortableDateValue(b.data.date) - getSortableDateValue(a.data.date));
}

export async function getRankingPostsByCategory(category: RankingCategory) {
  const posts = await getAllRankingPosts();
  return posts.filter((post) => post.data.category === category);
}

export async function loadRankingData(dataFile: string): Promise<RankingData> {
  const filePath = path.resolve(process.cwd(), dataFile);
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as RankingData;
}

export function getPostUrl(post: CollectionEntry<"rankings">) {
  return withBasePath(`rankings/${post.id}/`);
}

export function getCategoryUrl(category: RankingCategory) {
  return withBasePath(`categories/${category}/`);
}
