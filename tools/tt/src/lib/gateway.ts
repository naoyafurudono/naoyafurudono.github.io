import fs from "node:fs";
import path from "node:path";
// 一覧を返す
import type { List, ListItem } from "mdast";
import { render } from "./render";
import { type Brand, hash, lexOrder } from "./util";

export type ArticleID = Brand<string, "article">;
export type PublishedDate = Brand<string, "published date">;

export type Article = {
  id: ArticleID;
  path: string;
  date: PublishedDate;
  title: string;
  draft: boolean;
  desc: string;
  unchecked: ListItem[];
  rawBody: string;
  toc: List | undefined;
  before?: ArticleID;
  after?: ArticleID;
};

export function isDraft(a: Article): boolean {
  return !!a.draft;
}

const memo: Map<string, Article[]> = new Map();
export async function listArticles(directoryPaths: string[]): Promise<Article[]> {
  const memoKey = hash(directoryPaths);
  const m = memo.get(memoKey);
  if (m) {
    return m;
  }
  const a = directoryPaths.flatMap((directoryPath) => {
    return fs
      .readdirSync(directoryPath, { withFileTypes: true })
      .filter((de) => de.isFile() && de.name.endsWith(".md"))
      .map((de) => de.name)
      .map(async (filename) => {
        const fpath = path.join(directoryPath, filename);
        const name = path.parse(filename).name;
        let content: Buffer = Buffer.from("");
        try {
          content = fs.readFileSync(fpath);
        } catch (_e) {
          console.error(`failed to do op: ${fpath}`);
        }
        const r = await render({ content });
        return {
          id: name as ArticleID,
          path: fpath,
          title: r.title,
          date: r.date,
          draft: r.draft,
          desc: r.desc,
          unchecked: r.unchecked,
          rawBody: r.rawBody,
          toc: r.toc,
        };
      });
  });
  const res: Article[] = (await Promise.all(a)).filter((a) => !isDraft(a));
  res.sort((a, b) => -lexOrder(a.date, b.date));
  for (let i = 0; i < res.length; i++) {
    const a = res[i];
    // 最新（latest)の記事が最小の記事
    a.after = i > 0 ? res[i - 1].id : undefined;
    a.before = i < res.length - 1 ? res[i + 1].id : undefined;
  }
  memo.set(memoKey, res);
  return res;
}

export async function findArticle({
  articleId,
  directoryPaths,
}: {
  articleId: ArticleID;
  directoryPaths: string[];
}): Promise<Article | null> {
  const article = await listArticles(directoryPaths).then((as) =>
    as.find((v) => v.id === articleId)
  );
  return article ?? null;
}
