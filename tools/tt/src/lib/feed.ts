import { Feed } from "feed";
import { siteTitle } from "./config";
import type { ArticleMeta } from "./gateway";

export function generateFeed(articles: ArticleMeta[]) {
	const baseUrl = process.env.SITE_URL || "https://diary.nfurudono.com"; // 環境変数から取得
	const feed = new Feed({
		title: siteTitle,
		description: "これは日記です",
		id: baseUrl,
		link: baseUrl,
		language: "ja",
		favicon: `${baseUrl}/favicon.ico`,
		copyright: "All rights reserved 2024, Naoya Furudono",
		author: {
			name: "Naoya Furudono",
			email: "contact@nfurudono.com",
			link: "https://blog.nfurudono.com/profile/",
		},
	});

	for (const article of articles) {
		feed.addItem({
			title: article.title,
			id: `${baseUrl}/posts/${article.id}`,
			link: `${baseUrl}/posts/${article.id}`,
			description: article.desc,
			date: new Date(article.date),
		});
	}

	return feed.rss2();
}
