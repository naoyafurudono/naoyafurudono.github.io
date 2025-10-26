import type { APIRoute } from "astro";
import { articleDirectoryPaths } from "@/lib/config";
import { generateFeed } from "@/lib/feed";
import { listArticles } from "@/lib/gateway";
import { lexOrder } from "@/lib/util";

export const GET: APIRoute = async () => {
  const articles = await listArticles(articleDirectoryPaths);
  articles.sort((a, b) => -lexOrder(a.date, b.date));

  const feed = generateFeed(articles);

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
