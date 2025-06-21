import type { NextPage } from "next";
import { articleDirectoryPaths, postPath, showDateOnTopPage } from "@/lib/config";
import { type ArticleMeta, listArticles } from "@/lib/gateway";
import { lexOrder } from "@/lib/util";

const Home: NextPage = async () => {
  const as: ArticleMeta[] = await listArticles(articleDirectoryPaths);
  return (
    <ol>
      {as
        .toSorted((a, b) => -lexOrder(a.date, b.date))
        .map((article) => (
          <li key={article.id}>
            <ArticleSummary article={article} />
          </li>
        ))}
    </ol>
  );
};
export default Home;

type SummaryProps = {
  article: ArticleMeta;
};
const ArticleSummary = async ({ article }: SummaryProps) => {
  return (
    <article>
      <div>
        <a href={postPath(article.id)}>{article.title}</a>
        {showDateOnTopPage && (
          <p>
            <time>{article.date}</time>
          </p>
        )}
        <p>{article.desc}</p>
      </div>
    </article>
  );
};
