import type { List, ListItem, Root, RootContent } from "mdast";
import rehypeExtractExcerpt from "rehype-extract-excerpt";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import behead from "remark-behead";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import * as yaml from "yaml";
import type { Draft, On } from "./gateway";
import genTOC, {
	addHeadingIds,
	ignoreNewLine,
	putIDOnTODOItem,
	rehypeReferredElement,
	unchecked,
} from "./plugin";

export type RenderResult = {
	rawBody: string;
	date: On;
	title: string;
	draft: Draft;
	desc: string;
	unchecked: ListItem[];
	// about: AboutSections;
	toc: List | undefined;
};

export async function render({
	content,
}: { content: Buffer }): Promise<RenderResult> {
	const result = await unified()
		.use(remarkParse)
		.use(behead, { minDepth: 2 }) // headingの深さの最小を2にするやつ。"## hoge\n" みたいなmd行は深さ3になる。
		// remarkFrontmatterとremarkExtractFrontmatterは二つで一つ。
		// 前者がフロントマターをマークダウンから分離して
		// 後者がそれを解釈してメタデータに落とし込む
		// そう、フロントマターをマークダウンとして解釈するのは間違いで、僕たちは横着してキメラしているだけなのだ...
		.use(remarkFrontmatter, [{ type: "yaml", marker: "-", anywhere: false }])
		.use(remarkExtractFrontmatter, { yaml: yaml.parse, name: "frontmatter" })
		.use(remarkGfm)
		.use(ignoreNewLine)
		.use(addHeadingIds)
		.use(genTOC)
		.use(unchecked)
		// .use(extractAboutSections)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
		.use(putIDOnTODOItem)
		.use(rehypeReferredElement)
		.use(rehypeExtractExcerpt) // 概要をとるやつ。
		.use(rehypeStringify)
		.process(content);
	const frontmater = result.data.frontmatter as {
		date: string;
		title: string;
		draft: boolean;
	};
	return {
		rawBody: result.toString(),

		// frontmatter
		date: frontmater.date as string as On,
		title: frontmater.title as string,
		draft: frontmater.draft as boolean as Draft,

		// by rehypeExtractExcerpt
		desc: result.data.excerpt as string,

		// by unchecked
		unchecked: result.data.unchecked as ListItem[],
		// about: result.data.about as AboutSections,
		toc: result.data.toc as List | undefined,
	};
}

export async function renderMdAst(ast: Root): Promise<string> {
	const hype = await unified().use(remarkRehype).run(ast);
	const res = unified().use(rehypeStringify).stringify(hype);
	return res;
}

export function newRoot(data: RootContent[]): Root {
	return {
		type: "root",
		children: data,
	};
}
export function newUL(items: ListItem[]): List {
	return {
		type: "list",
		ordered: false,
		children: items,
	};
}
