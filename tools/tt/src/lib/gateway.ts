// 一覧を返す
import fs from "node:fs";
import path from "node:path";
import type { ListItem } from "mdast";
import { render } from "./render";

const articleDirectoryPaths: string[] =
	process.env.ARTICLE_DIRECTORY_PATHS?.split(",") || [
		path.join(process.cwd(), "article"),
	];

export type ArticleMeta = {
	id: string;
	path: string;
	date: string;
	title: string;
	draft: boolean;
	desc: string;
	unchecked: ListItem[];
};
export type Article = {
	content: Buffer;
} & ArticleMeta;

export function isDraft(a: ArticleMeta): boolean {
	return a.draft;
}

export async function listPublishedArticles(): Promise<Article[]> {
	const a = await listArticles();
	return a.filter((a) => !isDraft(a));
}

let memo: Promise<Article[]>;
export async function listArticles(): Promise<Article[]> {
	if (memo) {
		return memo;
	}
	const a = articleDirectoryPaths.flatMap((directoryPath) => {
		return fs
			.readdirSync(directoryPath, { withFileTypes: true })
			.filter((de) => de.isFile() && de.name.endsWith(".md"))
			.map((de) => de.name)
			.map(async (filename) => {
				const fpath = path.join(directoryPath, filename);
				const name = path.parse(filename).name;
				let content = Buffer.from("");
				try {
					content = fs.readFileSync(fpath);
				} catch (_e) {
					console.error(`failed to do op: ${fpath}`);
				}
				const r = await render({ content });
				return {
					id: name,
					path: fpath,
					title: r.title,
					date: r.date,
					content: content,
					draft: r.draft,
					desc: r.desc,
					unchecked: r.unchecked,
				};
			});
	});
	memo = Promise.all(a);
	return memo;
}

export async function findArticle({
	articleId,
}: { articleId: string }): Promise<Article | null> {
	const m = await listArticles().then((as) =>
		as.find((v) => {
			return v.id === articleId;
		}),
	);
	if (!m) {
		return null;
	}
	const content = fs.readFileSync(m.path);
	return { ...m, content };
}
