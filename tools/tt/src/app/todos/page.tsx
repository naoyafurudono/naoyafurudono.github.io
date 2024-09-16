import { type ArticleMeta, listPublishedArticles } from "@/lib/gateway";
import { renderMdAst } from "@/lib/render";
import * as util from "@/lib/util";
import type { List, ListItem, Root, RootContent } from "mdast";
import type { NextPage } from "next";

const Home: NextPage = async () => {
	const as: Array<ArticleMeta> = await listPublishedArticles();
	return (
		<>
			<h1>残ったtodo</h1>
			<ol>
				{as
					.filter((article) => article.unchecked.length > 0)
					.toSorted((a, b) => -util.lexOrder(a.date, b.date))
					.map((article) => (
						<li key={article.id}>
							<TodoSummary article={article} />
						</li>
					))}
			</ol>
		</>
	);
};
export default Home;

function newRoot(data: RootContent[]): Root {
	return {
		type: "root",
		children: data,
	};
}
function newUL(items: ListItem[]): List {
	return {
		type: "list",
		ordered: false,
		children: items,
	};
}

type SummaryProps = {
	article: ArticleMeta;
};
const TodoSummary = async ({ article }: SummaryProps) => {
	const root = newRoot([newUL(article.unchecked)]);
	const todohtml = await renderMdAst(root);
	return (
		<div>
			<a href={util.postPath(article.id)}>
				<h2>{article.title}</h2>
			</a>
			<div
				// biome-ignore lint/security/noDangerouslySetInnerHtml: 記事の一部がここに渡るだけなのでok
				dangerouslySetInnerHTML={{ __html: todohtml }}
			/>
		</div>
	);
};
