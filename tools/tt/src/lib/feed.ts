import { Feed } from "feed";
import { baseUrl, siteTitle } from "./config";
import type { Article } from "./gateway";

export function generateFeed(articles: Article[]) {
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
      email: "naoyafurudono@gmail.com",
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
