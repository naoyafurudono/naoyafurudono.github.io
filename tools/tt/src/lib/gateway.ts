// 一覧を返す
import fs from "fs";

export type Article = {
  content: Buffer;
  id: string;
};
export function listArticles(): Array<Article> {
  const filepath = "article/2023-09-24.md";
  const content = fs.readFileSync(filepath);
  const id =  "2023-09-24";
  return [{ content, id }];
}

export function getArticle({ articleId }: { articleId: string }): Article {
  const filepath = `article/${articleId}.md`;
  const content = fs.readFileSync(filepath)
  return { content, id: articleId };
}