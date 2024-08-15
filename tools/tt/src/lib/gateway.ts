// 一覧を返す
import fs from "node:fs";
import path from "node:path";
import { render } from "./render";

const articleDirectoryPaths = process.env.ARTICLE_DIRECTORY_PATHS?.split(
	",",
) || [path.join(process.cwd(), "article")];

export type ArticleMeta = {
	id: string;
	path: string;
	date: string;
	title: string;
};
export type Article = {
	content: Buffer;
} & ArticleMeta;

export async function listArticles(): Promise<Array<Article>> {
	const a = articleDirectoryPaths.flatMap((directoryPath) => {
		return fs.readdirSync(directoryPath).map(async (filename) => {
			const fpath = path.join(directoryPath, filename);
			const name = path.parse(filename).name;
			const content = fs.readFileSync(fpath);
			const r = await render({ content });
			return {
				id: name,
				path: fpath,
				title: r.title,
				date: r.date,
				content: content,
			};
		});
	});
	return Promise.all(a);
}

export async function findArticle({
	articleId,
}: {
	articleId: string;
}): Promise<Article | null> {
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
