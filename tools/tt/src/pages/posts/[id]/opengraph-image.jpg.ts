import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";
import { articleDirectoryPaths, withSiteTitle } from "@/lib/config";
import { type ArticleID, findArticle, listArticles } from "@/lib/gateway";

// フォントをキャッシュ
let fontData: Buffer | null = null;

function getFont(): Buffer {
  if (fontData) {
    return fontData;
  }
  const fontPath = path.join(process.cwd(), "src/assets/fonts/NotoSansJP-Regular.ttf");
  fontData = fs.readFileSync(fontPath);
  return fontData;
}

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

  const font = getFont();

  const svg = await satori(
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
      fonts: [
        {
          name: "Noto Sans JP",
          data: font,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  const jpegBuffer = await sharp(Buffer.from(svg)).jpeg({ quality: 80 }).toBuffer();

  return new Response(new Uint8Array(jpegBuffer), {
    headers: {
      "Content-Type": "image/jpeg",
    },
  });
};
