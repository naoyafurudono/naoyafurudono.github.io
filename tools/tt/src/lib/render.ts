import rehypeStringify from "rehype-stringify";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import * as yaml from "yaml";
import type { Article } from "./gateway";

export type RenderResult = {
	rawBody: string;
	date: string;
	title: string;
};

export async function render(a: Article): Promise<RenderResult> {
	const frontmatter: Node | null = null;
	const result = await unified()
		.use(remarkParse)
		.use(remarkFrontmatter)
		.use(remarkExtractFrontmatter, { yaml: yaml.parse })
		.use(remarkRehype)
		.use(rehypeStringify)
		.process(a.content);
	return {
		rawBody: result.toString(),
		date: result.data.date as string,
		title: result.data.title as string,
	};
}
