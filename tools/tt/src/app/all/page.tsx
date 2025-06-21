import type { Metadata, NextPage } from "next";
import { articleDirectoryPaths, postPath, withSiteTitle } from "@/lib/config";
import { type Article, listArticles } from "@/lib/gateway";
import { render } from "@/lib/render";
import { lexOrder } from "@/lib/util";

const Articles: NextPage = async () => {
	const articles: Article[] = await listArticles(articleDirectoryPaths);
	const renderedArticles = await Promise.all(
		articles.map(async (article) => {
			const rendered = await render(article);
			return {
				...article,
				rendered,
			};
		}),
	);

	return (
		<div>
			<h1>全ての記事</h1>
			{renderedArticles
				.toSorted((a, b) => -lexOrder(a.date, b.date))
				.map((article) => (
					<article key={article.id}>
						<header>
							<h2>
								<a href={postPath(article.id)}>{article.title}</a>
							</h2>
							<time>{article.date}</time>
						</header>
						<div
							// biome-ignore lint/security/noDangerouslySetInnerHtml: 記事の内容は信頼できる
							dangerouslySetInnerHTML={{ __html: article.rendered.rawBody }}
						/>
						<hr />
					</article>
				))}
		</div>
	);
};

export default Articles;

export const metadata: Metadata = {
	title: withSiteTitle("全ての記事"),
	description: "全ての記事を一つのページで表示します",
};
