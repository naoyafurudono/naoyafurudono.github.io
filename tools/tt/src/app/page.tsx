import { type Article, listArticles } from "@/lib/gateway";
import { render } from "@/lib/render";
import type { NextPage } from "next";

type Props = {
	params: {
		id: string;
	};
};
const Home: NextPage<Props> = async () => {
	return (
		<>
			<h1>ツイートするには長すぎる</h1>
			<div>
				{listArticles().map((article) => (
					<ArticleSummary article={article} key={article.id} />
				))}
			</div>
		</>
	);
};
export default Home;

type SummaryProps = {
	article: Article;
};
const ArticleSummary = async ({ article }: SummaryProps) => {
	const res = await render(article);
	return (
		<article>
			<h1>
				<a href={`/posts/${article.id}`}>{res.title}</a>
			</h1>
  	  <time>{res.date}</time>
		</article>
	);
};
