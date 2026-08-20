---
name: rank-garden-screen-radar
description: Use when updating the rank-garden project with the daily global high-score film and TV radar, including realtime cross-platform research, deduplication, status handling, project JSON/Markdown output, validation, and publishing.
---

# rank-garden Screen Radar

Use this skill only inside the `rank-garden` repository.

## Required Reference

Before generating or updating the daily global film/TV radar, read the full operating prompt:

```text
../../docs/prompts/global-screen-radar-daily-prompt.md
```

That file defines the realtime research scope, quality rules, status model, deduplication process, output report shape, JSON format, Markdown format, validation commands, commit flow, and publishing checks.

## Project Outputs

Create or update these paired files for each date:

```text
data/rankings/movie/daily/YYYY-MM-DD.json
src/content/rankings/movie-daily-YYYY-MM-DD.md
```

Do not create Markdown without the matching JSON file.

## Non-Negotiable Research Rules

- Realtime retrieval is required. Do not recommend from model memory.
- Search globally, including non-English and lower-profile regions.
- Cross-check real audience communities, professional reviews, release status, and legal availability.
- If historical recommendation/status records cannot be fully accessed, explicitly say the deduplication history is incomplete.
- Do not present `WATCHED`, `EXCLUDED`, historical formal recommendations, or `WATCHLIST` entries as new recommendations.
- If reliable data is unavailable, write `暂无可靠数据` rather than guessing.

## Project Data Mapping

The current shared ranking schema is generic. For screen radar entries:

- Use `category: "movie"`.
- Use `stars` for the numeric recommendation index.
- Use `delta` for text such as `综合推荐指数 92/100`.
- Use `tags` for up to 5 concise labels.
- Use `comment` for the short recommendation rationale.

When the project later adds a screen-specific schema, migrate these fields instead of duplicating them.

## Validation

Before claiming the update is complete, run:

```bash
npm run validate:rankings
npm run build
```

For the GitHub Pages project site path, also use:

```powershell
$env:BASE_PATH='/rank-garden/'
npm run build
```

If any validation fails, report the failing command and fix the source files before committing.

## Publishing

After validation:

```bash
git status --short
git add data/rankings/movie/daily/YYYY-MM-DD.json src/content/rankings/movie-daily-YYYY-MM-DD.md
git commit -m "chore: update global screen radar YYYY-MM-DD"
git push origin main
```

Check the resulting page:

```text
https://sumuw.github.io/rank-garden/rankings/movie-daily-YYYY-MM-DD/
```

