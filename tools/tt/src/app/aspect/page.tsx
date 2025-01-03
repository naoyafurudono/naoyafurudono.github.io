import { type ArticleMeta, listArticles } from "@/lib/gateway";
import { renderMdAst } from "@/lib/render";
import * as util from "@/lib/util";
import type { List, ListItem, Root, RootContent } from "mdast";
import type { Metadata, NextPage } from "next";

const Home: NextPage = async () => {
	const as: ArticleMeta[] = await listArticles();
	return (
		<>
			<ol>
				{as
					.filter((article) => hasToDo(article))
					.toSorted((a, b) => -util.lexOrder(a.date, b.date))
					.map((article) => (
						// TODO summary はそれ自体がlist item
						<TodoSummary article={article} key={article.id} />
					))}
			</ol>
		</>
	);
};
export default Home;

function hasToDo(a: ArticleMeta): boolean {
	return a.unchecked.length > 0;
}

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
		<>
			<a href={util.postPath(article.id)}>{article.title}</a>
			<div
				// biome-ignore lint/security/noDangerouslySetInnerHtml: 記事の一部がここに渡るだけなのでok
				dangerouslySetInnerHTML={{ __html: todohtml }}
			/>
		</>
	);
};

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: util.withSiteTitle("todos"),
		description: "未消化のtodo一覧です",
	};
}
