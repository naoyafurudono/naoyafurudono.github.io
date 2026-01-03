# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog/diary system that generates two static sites from Markdown articles:
- **diary.nfurudono.com** - Daily entries from `content/daily/`
- **dev.nfurudono.com** - Technical posts from `content/posts/`

Built with Astro (TypeScript), deployed to Cloudflare Pages.

## Commands

All web commands run from `tools/tt/`:

```bash
# Development
npm run dev              # Start dev server
npm run build:diary      # Build diary site
npm run build:dev        # Build dev site

# Quality checks
npm run check            # Run biome + astro check + tests
npm run fix              # Auto-fix lint/format issues

# Testing
npm run test             # Run all tests (vitest)

# Deployment (from repo root)
make deploy              # Build and deploy both sites
```

Diary CLI (Go):
```bash
cd tools/diary && go install
diary <template>         # Generate diary entry from template
```

## Architecture

```
content/                  # Markdown articles (daily/, posts/, bio/)
tools/
├── tt/                   # Astro static site generator
│   ├── src/
│   │   ├── pages/        # Astro pages ([id].astro for articles)
│   │   ├── layouts/      # Page layouts
│   │   └── lib/          # Core utilities
│   │       ├── gateway.ts   # Article loading/caching
│   │       ├── render.ts    # Markdown → HTML pipeline
│   │       ├── plugin.ts    # Remark/Rehype plugins (TOC, headings)
│   │       └── config.ts    # Environment config
│   └── package.json
└── diary/                # Go CLI for generating entries
```

## Key Patterns

- **Environment-driven builds**: Same codebase builds different sites via `ARTICLE_DIRECTORY_PATHS` and `SITE_TITLE` env vars
- **Branded types**: TypeScript branded types (`ArticleID`, `PublishedDate`) for type safety in `lib/`
- **Unified/Remark pipeline**: Custom markdown processing with TOC generation and heading ID extraction
