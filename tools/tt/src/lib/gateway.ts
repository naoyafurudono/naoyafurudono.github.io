import fs from "node:fs";
import path from "node:path";
// 一覧を返す
import type { ListItem } from "mdast";
import { render } from "./render";
import { type Brand, lexOrder } from "./util";

const articleDirectoryPaths: string[] =
	process.env.ARTICLE_DIRECTORY_PATHS?.split(",") || [
		path.join(process.cwd(), "article"),
	];

export type ArticleID = Brand<string, "article">;
export type On = Brand<string, "publish on">;
export type Draft = Brand<boolean, "draft">;
export type ArticleMeta = {
	id: ArticleID;
	path: string;
	date: On;
	title: string;
	draft: Draft;
	desc: string;
	unchecked: ListItem[];
	// about: AboutSections;
};
export type Article = {
	content: Buffer;
	before?: string;
	after?: string;
} & ArticleMeta;

export function isDraft(a: ArticleMeta): boolean {
	return a.draft;
}

let memo: Article[];
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
					id: name as ArticleID,
					path: fpath,
					title: r.title,
					date: r.date,
					content: content,
					draft: r.draft,
					desc: r.desc,
					unchecked: r.unchecked,
					// about: r.about,
				};
			})
			.filter(async (a) => !isDraft(await a));
	});
	memo = await Promise.all(a);
	memo.sort((a, b) => -lexOrder(a.date, b.date));
	for (let i = 0; i < memo.length; i++) {
		const a = memo[i];
		// 最新（latest)の記事が最小の記事
		a.after = i > 0 ? memo[i - 1].id : undefined;
		a.before = i < memo.length - 1 ? memo[i + 1].id : undefined;
	}
	return memo;
}

export async function findArticle({
	articleId,
}: { articleId: ArticleID }): Promise<Article | null> {
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

// export async function listAspects(): Promise<Article[]> {
// 	const as = await listArticles();
// 	const aspects: Record<string, Node[]> = {};
// 	for (const a of as) {
// 		const about = a.about;
// 		for (const [key, value] of Object.entries(about)) {
// 			aspects[key].push(...value);
// 		}
// 	}
// 	return Object.entries(aspects).map(([key, value]) => {
// 		return {
// 			id: key,
// 			title: key,
// 			content: Buffer.from(value),
// 			unchecked: value,
// 		};
// 	});
// 	// 	draft: r.draft,
// 	// 	desc: r.desc,
// 	// 	unchecked: r.unchecked,
// 	// };
// }
