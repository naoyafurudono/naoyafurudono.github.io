import { type ArticleMeta, listArticles } from "@/lib/gateway";
import type { NextPage } from "next";

type Props = {
	params: {
		id: string;
	};
};
const Home: NextPage<Props> = async () => {
	return (
		<ol>
			{listArticles().map((article) => (
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
			<time>{article.date}</time>
		</article>
	);
};
