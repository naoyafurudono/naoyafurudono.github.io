import { findArticle, listArticles } from "@/lib/gateway";
import { type RenderResult, render } from "@/lib/render";
import type { Metadata, NextPage } from "next";

type Slugs = {
	params: {
		id: string;
	};
};
const Post: NextPage<Slugs> = async ({ params }) => {
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
			{before && <Textlink href={`/posts/${before}`} text={before} />}
			{after && <Textlink href={`/posts/${after}`} text={after} />}
		</>
	);
};
function Textlink({ text, href }: { text: string; href: string }) {
	return (
		<span style={{ marginInline: "5px" }}>
			<a href={href}>{text}</a>
		</span>
	);
}

export default Post;
export async function generateStaticParams() {
	const as = await listArticles();
	return as.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: Slugs): Promise<Metadata> {
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
