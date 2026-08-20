import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";

const site = process.env.SITE_URL || "https://sumuw.github.io";
const base = process.env.BASE_PATH || "/rank-garden/";

export default defineConfig({
  site,
  base,
  markdown: {
    processor: unified()
  }
});
