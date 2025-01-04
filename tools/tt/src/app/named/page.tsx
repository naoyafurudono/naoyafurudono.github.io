import { normalDirectoryPaths } from "@/lib/config";
import { type ArticleMeta, listArticles } from "@/lib/gateway";
import * as util from "@/lib/util";
import type { NextPage } from "next";

type Props = {
	params: {
		id: string;
	};
};
const Home: NextPage<Props> = async () => {
	const as: ArticleMeta[] = await listArticles(normalDirectoryPaths);
	return (
		<ol>
			{as
				.toSorted((a, b) => -util.lexOrder(a.date, b.date))
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
				<a href={util.normalPath(article.id)}>{article.title}</a>
				<p>
					<time>{article.date}</time>
				</p>
				<p>{article.desc}</p>
			</div>
		</article>
	);
};
