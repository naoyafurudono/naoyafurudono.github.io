import type { ListItem, Root } from "mdast";
import rehypeExtractExcerpt from "rehype-extract-excerpt";
import rehypeStringify from "rehype-stringify";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import * as yaml from "yaml";
import { addHeadingIds, ignoreNewLine, putIDOn, rehypeCopyElementURL, unchecked } from "./plugin";
import behead from "remark-behead";

export type RenderResult = {
  rawBody: string;
  date: string;
  title: string;
  draft: boolean;
  desc: string;
  unchecked: ListItem[];
  // about: AboutSections;
};

export async function render({ content }: { content: Buffer }): Promise<RenderResult> {
  const result = await unified()
    .use(remarkParse)
    .use(behead, { minDepth: 2 })
    .use(remarkFrontmatter)
    .use(remarkExtractFrontmatter, { yaml: yaml.parse })
    .use(remarkGfm)
    .use(ignoreNewLine)
    .use(addHeadingIds)
    .use(unchecked)
    // .use(extractAboutSections)
    .use(remarkRehype)
    .use(putIDOn("task-list-item"))
    .use(rehypeCopyElementURL)
    .use(rehypeExtractExcerpt) // 概要をとるやつ。
    .use(rehypeStringify)
    .process(content);
  return {
    rawBody: result.toString(),

    // frontmatter
    date: result.data.date as string,
    title: result.data.title as string,
    draft: result.data.draft as boolean,

    // by rehypeExtractExcerpt
    desc: result.data.excerpt as string,

    // by unchecked
    unchecked: result.data.unchecked as ListItem[],
    // about: result.data.about as AboutSections,
  };
}

export async function renderMdAst(ast: Root): Promise<string> {
  const hype = await unified().use(remarkRehype).run(ast);
  const res = unified().use(rehypeStringify).stringify(hype);
  return res;
}
