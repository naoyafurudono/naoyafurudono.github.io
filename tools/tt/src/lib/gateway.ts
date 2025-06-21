import fs from "node:fs";
import path from "node:path";
// 一覧を返す
import type { ListItem } from "mdast";
import { render } from "./render";
import { type Brand, hash, lexOrder } from "./util";

export type ArticleID = Brand<string, "article">;
export type On = Brand<string, "publish on">;
export type Draft = Brand<boolean, "draft">;
export type ArticleMeta = {
  id: ArticleID;
  path: string;
  date: On;
  title: string;
  draft: Draft;
  desc: string;
  unchecked: ListItem[];
  // about: AboutSections;
};
export type Article = {
  content: Buffer;
  before?: ArticleID;
  after?: ArticleID;
} & ArticleMeta;

export function isDraft(a: ArticleMeta): boolean {
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
          content: content,
          draft: r.draft,
          desc: r.desc,
          unchecked: r.unchecked,
          // about: r.about,
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
  const m = await listArticles(directoryPaths).then((as) =>
    as.find((v) => {
      return v.id === articleId;
    })
  );
  if (!m) {
    return null;
  }
  const content = fs.readFileSync(m.path);
  return { ...m, content };
}
