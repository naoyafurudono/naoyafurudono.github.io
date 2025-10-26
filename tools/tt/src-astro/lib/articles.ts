import fs from "fs";
import path from "path";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ArticleMeta {
  id: string;
  date: string;
  title: string;
  draft: boolean;
  desc: string;
  tags?: string[];
  author?: string;
}

export interface Article extends ArticleMeta {
  content: string;
}

const articleDirectoryPaths = [path.join(process.cwd(), "article")];

// Extract frontmatter from markdown content
function parseFrontmatter(content: string): { frontmatter: any; body: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const [, frontmatterText, body] = match;
  const frontmatter: any = {};

  // Simple YAML parser for basic key-value pairs
  const lines = frontmatterText.split("\n");
  let currentKey = "";

  for (const line of lines) {
    if (line.trim().startsWith("-") && currentKey) {
      // Array item
      if (!Array.isArray(frontmatter[currentKey])) {
        frontmatter[currentKey] = [];
      }
      frontmatter[currentKey].push(line.trim().substring(1).trim().replace(/^"|"$/g, ""));
    } else if (line.includes(":")) {
      // Key-value pair
      const colonIndex = line.indexOf(":");
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();

      currentKey = key;

      if (value) {
        frontmatter[key] = value.replace(/^"|"$/g, "");
      }
    }
  }

  return { frontmatter, body };
}

async function renderMarkdown(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}

export async function listArticles(): Promise<ArticleMeta[]> {
  const articles: ArticleMeta[] = [];

  for (const directoryPath of articleDirectoryPaths) {
    if (!fs.existsSync(directoryPath)) {
      continue;
    }

    const files = fs.readdirSync(directoryPath, { withFileTypes: true });

    for (const file of files) {
      if (!file.isFile() || !file.name.endsWith(".md")) {
        continue;
      }

      const filePath = path.join(directoryPath, file.name);
      const content = fs.readFileSync(filePath, "utf-8");
      const { frontmatter, body } = parseFrontmatter(content);

      const id = path.parse(file.name).name;

      // Extract description from body (first paragraph)
      const descMatch = body.trim().match(/^(.+?)(?:\n\n|$)/);
      const desc = descMatch ? descMatch[1].trim() : "";

      articles.push({
        id,
        date: frontmatter.date || id,
        title: frontmatter.title || id,
        draft: frontmatter.draft === "true" || frontmatter.draft === true,
        desc,
        tags: frontmatter.tags || [],
        author: frontmatter.author,
      });
    }
  }

  // Filter out drafts and sort by date
  return articles.filter((a) => !a.draft).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getArticle(id: string): Promise<Article | null> {
  for (const directoryPath of articleDirectoryPaths) {
    const filePath = path.join(directoryPath, `${id}.md`);

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const { frontmatter, body } = parseFrontmatter(content);

      const descMatch = body.trim().match(/^(.+?)(?:\n\n|$)/);
      const desc = descMatch ? descMatch[1].trim() : "";

      const htmlContent = await renderMarkdown(body);

      return {
        id,
        date: frontmatter.date || id,
        title: frontmatter.title || id,
        draft: frontmatter.draft === "true" || frontmatter.draft === true,
        desc,
        tags: frontmatter.tags || [],
        author: frontmatter.author,
        content: htmlContent,
      };
    }
  }

  return null;
}
