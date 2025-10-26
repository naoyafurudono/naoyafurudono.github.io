import { ImageResponse } from "@vercel/og";
import type { APIRoute } from "astro";
import { articleDirectoryPaths, withSiteTitle } from "@/lib/config";
import { type ArticleID, findArticle, listArticles } from "@/lib/gateway";

export async function getStaticPaths() {
  const articles = await listArticles(articleDirectoryPaths);
  return articles.map((a) => ({ params: { id: a.id } }));
}

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  const article = await findArticle({
    articleId: id as ArticleID,
    directoryPaths: articleDirectoryPaths,
  });

  if (!article) {
    return new Response("Not found", { status: 404 });
  }

  const imageResponse = new ImageResponse(
    {
      type: "div",
      props: {
        style: {
          fontSize: 40,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        children: withSiteTitle(article.title),
      },
    },
    {
      width: 1200,
      height: 630,
    }
  );

  return new Response(await imageResponse.arrayBuffer(), {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
