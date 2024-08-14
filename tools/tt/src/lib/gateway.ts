// 一覧を返す
import fs from "node:fs";
import path from "node:path";

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
export function listArticles(): Array<ArticleMeta> {
	return articleDirectoryPaths.flatMap((directoryPath) => {
		return fs.readdirSync(directoryPath).map((filename) => {
			const fpath = path.join(directoryPath, filename);
			const name = path.parse(filename).name;
			return {
				id: name,
				path: fpath,
				title: "todo: title",
				date: "todo: date",
			};
		});
	});
}

export function findArticle({
	articleId,
}: {
	articleId: string;
}): Article | null {
	const m = listArticles().find((v) => {
		return v.id === articleId;
	});
	if (!m) {
		return null;
	}
	const content = fs.readFileSync(m.path);
	return { ...m, content };
}
