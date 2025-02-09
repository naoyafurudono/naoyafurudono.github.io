import fs from "node:fs";
import path from "node:path";
import { articleDirectoryPaths } from "@/lib/config";
import { generateFeed } from "@/lib/feed";
import { listArticles } from "@/lib/gateway";
import { lexOrder } from "@/lib/util";

// ビルド時に実行される
export async function GET() {
	const articles = await listArticles(articleDirectoryPaths);
	articles.sort((a, b) => -lexOrder(a.date, b.date));

	const feed = generateFeed(articles);

	return new Response(feed, {
		headers: {
			"Content-Type": "application/xml",
		},
	});
}

// 静的生成を有効化
export const dynamic = "force-static";
