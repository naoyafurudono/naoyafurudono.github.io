// os.envへのアクセスは全てここで行う
import path from "node:path";

export const diaryDirectoryPaths: string[] =
	process.env.ARTICLE_DIRECTORY_PATHS?.split(",") || [
		path.join(process.cwd(), "article"),
	];
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
