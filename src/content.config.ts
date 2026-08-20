import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const rankings = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/rankings" }),
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
