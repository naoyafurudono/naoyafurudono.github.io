import { findArticle, listArticles } from "@/lib/gateway";
import { type RenderResult, render } from "@/lib/render";
import type { Metadata, NextPage } from "next";

type Props = {
	params: {
		id: string;
		before?: string;
		after?: string;
	};
};
const Post: NextPage<Props> = async ({ params }) => {
	const { id } = params;
	const a = await findArticle({ articleId: id });
	if (!a) {
		throw new Error("Not found");
	}
	const rendered: RenderResult = await render(a);
	const { before, after } = a;
	return (
		<>
			<article>
				<h1>{rendered.title}</h1>
				<time>{rendered.date}</time>
				<div
					// biome-ignore lint/security/noDangerouslySetInnerHtml: 入力は信頼してok
					dangerouslySetInnerHTML={{ __html: rendered.rawBody.toString() }}
				/>
			</article>
			<ol>
				{before && (
					<li>
						<a href={`/posts/${before}`}>{`< ${before}`}</a>
					</li>
				)}
				{after && (
					<li>
						<a href={`/posts/${after}`}>{`${after} >`}</a>
					</li>
				)}
			</ol>
		</>
	);
};

export default Post;
export async function generateStaticParams() {
	const as = await listArticles();
	return as.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = params;
	const a = await findArticle({ articleId: id });
	if (!a) {
		throw new Error(`Not found: ${id}`);
	}
	const r = await render(a);
	return {
		title: r.title,
		description: r.desc,
	};
}
