---
name: rank-garden-github-trending
description: Use when updating the rank-garden project with a daily GitHub Trending ranking, generating project JSON/Markdown, validating, committing, pushing, or diagnosing the published GitHub ranking page.
---

# rank-garden GitHub Trending

Use this skill only inside the `rank-garden` repository.

## Required Reference

Before generating or updating a GitHub daily ranking, read the full operating prompt:

```text
../../docs/prompts/github-trending-daily-ranking-prompt.md
```

That file defines the data source, required fields, Markdown format, JSON format, validation commands, commit flow, and publishing checks.

## Project Outputs

Create or update these paired files for each date:

```text
data/rankings/github/daily/YYYY-MM-DD.json
src/content/rankings/github-daily-YYYY-MM-DD.md
```

Do not create Markdown without the matching JSON file.

## Invariants

- Realtime source verification is required when generating a new daily ranking.
- Facts such as repository name, URL, language, stars, and daily stars must come from the source, not from model memory.
- AI-generated content may summarize, tag, and comment, but must not invent facts.
- `tags` must contain at most 5 items.
- `rank` must start at 1 and increase continuously.
- `category`, `period`, and `date` must match between Markdown frontmatter and JSON.

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
git add data/rankings/github/daily/YYYY-MM-DD.json src/content/rankings/github-daily-YYYY-MM-DD.md
git commit -m "chore: update github daily ranking YYYY-MM-DD"
git push origin main
```

Check the resulting page:

```text
https://sumuw.github.io/rank-garden/rankings/github-daily-YYYY-MM-DD/
```

