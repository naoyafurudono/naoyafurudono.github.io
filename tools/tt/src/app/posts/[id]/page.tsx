import { findArticle, listPublishedArticles } from "@/lib/gateway";
import { type RenderResult, render } from "@/lib/render";
import type { Metadata, NextPage } from "next";

type Props = {
	params: {
		id: string;
	};
};
const Post: NextPage<Props> = async ({ params }) => {
	const { id } = params;
	const a = await findArticle({ articleId: id });
	if (!a) {
		throw new Error("Not found");
	}
	const rendered: RenderResult = await render(a);

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
		</>
	);
};

export default Post;
export async function generateStaticParams() {
	const as = await listPublishedArticles();
	return as.map((a) => ({
		id: a.id,
	}));
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
