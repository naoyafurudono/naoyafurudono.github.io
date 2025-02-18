import { articleDirectoryPaths, postUrl, siteTitle } from "@/lib/config";
import { withSiteTitle } from "@/lib/config";
import { type ArticleID, findArticle, listArticles } from "@/lib/gateway";
import { type RenderResult, newRoot, render, renderMdAst } from "@/lib/render";
import type { Metadata, NextPage } from "next";

type Slugs = {
	params: Promise<{
		id: string;
	}>;
};
const Post: NextPage<Slugs> = async (props) => {
	const params = await props.params;
	const { id } = params;
	const a = await findArticle({
		articleId: id as ArticleID,
		directoryPaths: articleDirectoryPaths,
	});
	if (!a) {
		throw new Error("Not found");
	}
	const rendered: RenderResult = await render(a);
	const toc = rendered.toc && (await renderMdAst(newRoot([rendered.toc])));
	const { before, after } = a;
	return (
		<>
			<article>
				<h1>{rendered.title}</h1>
				<time>{rendered.date}</time>
				{toc && (
					<div
						// biome-ignore lint/security/noDangerouslySetInnerHtml: TOCは信頼してok
						dangerouslySetInnerHTML={{
							__html: toc,
						}}
					/>
				)}
				<div
					// biome-ignore lint/security/noDangerouslySetInnerHtml: 日記の記事は信頼してok
					dangerouslySetInnerHTML={{ __html: rendered.rawBody.toString() }}
				/>
			</article>
			{before ? (
				<Textlink href={`/posts/${before}`} text={`< ${before}`} />
			) : (
				"この記事が最古です"
			)}
			{after ? (
				<Textlink href={`/posts/${after}`} text={`${after} >`} />
			) : (
				"この記事が最新です"
			)}
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
	const as = await listArticles(articleDirectoryPaths);
	return as.map((a) => ({ id: a.id }));
}

export async function generateMetadata(props: Slugs): Promise<Metadata> {
	const params = await props.params;
	const { id } = params;
	const a = await findArticle({
		articleId: id as ArticleID,
		directoryPaths: articleDirectoryPaths,
	});
	if (!a) {
		throw new Error(`Not found: ${id}`);
	}
	const r = await render(a);
	return {
		title: withSiteTitle(r.title),
		description: r.desc,
		openGraph: {
			title: withSiteTitle(r.title),
			description: r.desc,
			url: postUrl(id),
			siteName: siteTitle,
		},
		twitter: {
			title: withSiteTitle(r.title),
			description: r.desc,
			creator: "@furudono2",
		},
	};
}
