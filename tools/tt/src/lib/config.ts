// os.envへのアクセスは全てここで行う
import path from "node:path";

export const diaryDirectoryPaths: string[] =
	process.env.ARTICLE_DIRECTORY_PATHS?.split(",") || [
		path.join(process.cwd(), "article"),
	];
export const commitHash = process.env.COMMIT_HASH || "unknown";
