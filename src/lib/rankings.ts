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
}

export interface RankingData {
  category: RankingCategory;
  period: RankingPeriod;
  date: string;
  source: string;
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

export async function getAllRankingPosts() {
  const posts = await getCollection("rankings");
  return posts.sort((a, b) => b.data.date.localeCompare(a.data.date));
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
  return `${baseUrl}rankings/${post.id}/`;
}

export function getCategoryUrl(category: RankingCategory) {
  return `${baseUrl}categories/${category}/`;
}
