# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See also the root `../../CLAUDE.md` for project-wide context.

## Commands

```bash
npm run dev              # Start Astro dev server
npm run build:diary      # Build diary site (content/daily)
npm run build:dev        # Build dev site (content/posts)
npm run check            # biome ci + astro check + vitest (use this before committing)
npm run fix              # Auto-fix lint/format issues
npm run test             # Run all tests (vitest run)
npx vitest run src/lib/render.test.ts  # Run a single test file
```

Node 23.x is required (`engines` in package.json).

## Code Style (Biome)

- Double quotes, semicolons, trailing commas (ES5), 2-space indent, 100 char line width
- `useImportType`: must use `import type` for type-only imports
- `useNodejsImportProtocol`: must use `node:` prefix for Node.js built-ins
- `useSortedClasses`: CSS class names must be sorted (Tailwind-style ordering)
- `noExplicitAny`: warn; `noUnusedImports`/`noUnusedVariables`: error
- Array types must use shorthand syntax (`string[]` not `Array<string>`)

## Architecture

### Markdown Rendering Pipeline (`src/lib/render.ts` → `plugin.ts`)

Articles are processed through a unified/remark/rehype pipeline:
1. Parse markdown → mdast (remark-parse)
2. Normalize headings to start at h2 (remark-behead)
3. Extract YAML frontmatter (title, date, draft, description)
4. Apply GFM, then custom plugins: TOC generation, heading ID slugification, TODO extraction
5. Convert to HTML (remark-rehype → rehype-stringify)
6. Extract first paragraph as excerpt

`render.ts` returns a `RenderResult` with: rawBody (HTML), date, title, draft, description, unchecked (TODO items), and toc (table of contents HTML).

### Article Loading (`src/lib/gateway.ts`)

- `listArticles()` reads markdown files from configured directories, renders them, and caches results in memory (keyed by hashed directory paths)
- Articles are sorted in reverse lexicographic order (newest first)
- Uses branded types `ArticleID` and `PublishedDate` for type safety (see `util.ts` for the `Brand` type)
- Each article has `before`/`after` navigation links to adjacent articles

### Environment-Driven Builds (`src/lib/config.ts`)

All env var access goes through `config.ts`. Key variables:
- `ARTICLE_DIRECTORY_PATHS` — comma-separated paths to article directories
- `SITE_TITLE` — site name shown in layout
- `SHOW_DATE_ON_TOP_PAGE` — whether to display dates on the index page
- `SITE_URL`, `COMMIT_HASH`

### OG Image Generation (`src/pages/posts/[id]/opengraph-image.jpg.ts`)

Per-article Open Graph images generated at build time using Satori (JSX → SVG) + Sharp (SVG → JPEG). Loads NotoSansJP font (cached in memory) for Japanese text rendering.

### Pages

- `posts/[id].astro` — individual article with prev/next navigation
- `index.astro` — article listing
- `all.astro` — all articles with full content on one page
- `todos.astro` — aggregated unchecked TODOs from all articles
- `feed.xml.ts` — RSS feed (APIRoute)
