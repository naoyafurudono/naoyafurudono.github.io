// os.envへのアクセスは全てここで行う
import path from "node:path";

export const articleDirectoryPaths: string[] =
	process.env.ARTICLE_DIRECTORY_PATHS?.split(",") || [
		path.join(process.cwd(), "article"),
	];
export const baseUrl = process.env.SITE_URL || "https://diary.nfurudono.com"; // 環境変数から取得
export const postPath = (id: string) => `/posts/${id}/`;
export const postUrl = (id: string) => `${baseUrl}${postPath(id)}`
export const withSiteTitle = (name: string) => `${name} | ${siteTitle}`;
export const siteTitle: string =
	process.env.SITE_TITLE || "diary.nfurudono.com";
export const showDateOnTopPage = parseBoolean(
	process.env.SHOW_DATE_ON_TOP_PAGE || "false",
);
function parseBoolean(s: string): boolean | undefined {
	switch (s) {
		case "true":
			return true;
		case "false":
			return false;
		default:
			return undefined;
	}
}
export const commitHash = process.env.COMMIT_HASH || "unknown";
