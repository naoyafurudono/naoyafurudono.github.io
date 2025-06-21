import type { Metadata, NextPage } from "next";
import { articleDirectoryPaths, postPath, withSiteTitle } from "@/lib/config";
import { type ArticleMeta, listArticles } from "@/lib/gateway";
import { newRoot, newUL, renderMdAst } from "@/lib/render";
import * as util from "@/lib/util";

const Home: NextPage = async () => {
	const as: ArticleMeta[] = await listArticles(articleDirectoryPaths);
	return (
		/* 各記事にあるオリジナルのtodoアイテムに割り当てられたIDは
			<a href="https://diary.nfurudono.com/posts/2024-10-14/#すべてのtodoアイテムにクリックでリンクコピーが可能なsvgをつけた。そのためにidを生成しているのだけど、コンテンツのハッシュ値を用いているのでテキストを加えたりするだけでアンカーが壊れる。直したい。">
				アイテムのタイトルに相当するテキストをそのまま用います
			</a>
			。 */
		<ol>
			{as
				.filter((article) => hasToDo(article))
				.toSorted((a, b) => -util.lexOrder(a.date, b.date))
				.map((article) => (
					// TODO summary はそれ自体がlist item
					<TodoSummary article={article} key={article.id} />
				))}
		</ol>
	);
};
export default Home;

function hasToDo(a: ArticleMeta): boolean {
	return a.unchecked.length > 0;
}

type SummaryProps = {
	article: ArticleMeta;
};
const TodoSummary = async ({ article }: SummaryProps) => {
	const root = newRoot([newUL(article.unchecked)]);
	const todohtml = await renderMdAst(root);
	return (
		<li>
			<a href={postPath(article.id)}>{article.title}</a>
			<div
				// biome-ignore lint/security/noDangerouslySetInnerHtml: 記事の一部がここに渡るだけなのでok
				dangerouslySetInnerHTML={{ __html: todohtml }}
			/>
		</li>
	);
};

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: withSiteTitle("todos"),
		description: "未消化のtodo一覧です",
	};
}
