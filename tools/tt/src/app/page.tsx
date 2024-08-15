import { type ArticleMeta, listArticles } from "@/lib/gateway";
import type { NextPage } from "next";

type Props = {
  params: {
    id: string;
  };
};
const Home: NextPage<Props> = async () => {
  const as: Array<ArticleMeta> = await listArticles();
  return (
    <ol>
      {as
        .toSorted((a,b) => -lexOrder(a.date, b.date))
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
        <a href={`/posts/${article.id}`}>{article.title}</a>
      </div>
    </article>
  );
};

function lexOrder(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}