import rehypeExtractExcerpt from "rehype-extract-excerpt";
import rehypeStringify from "rehype-stringify";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import * as yaml from "yaml";
import { ignoreNewLine } from "./plugin";

export type RenderResult = {
	rawBody: string;
	date: string;
	title: string;
	draft: boolean;
	desc: string;
};

export async function render({
	content,
}: { content: Buffer }): Promise<RenderResult> {
	const frontmatter: Node | null = null;
	const result = await unified()
		.use(remarkParse)
		.use(remarkFrontmatter)
		.use(remarkExtractFrontmatter, { yaml: yaml.parse })
		.use(ignoreNewLine)
		.use(remarkRehype)
		.use(rehypeExtractExcerpt)
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
	};
}
