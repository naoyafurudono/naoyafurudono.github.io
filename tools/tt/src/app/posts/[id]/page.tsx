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
			<style>
				{`
/* 記事ナビゲーションのスタイリング */
.article-navigation {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 1rem;
  margin: 3rem 0 2rem 0;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
}

.nav-item {
  flex: 1;
  display: flex;
  align-items: center;
}

.nav-prev {
  justify-content: flex-start;
}

.nav-next {
  justify-content: flex-end;
  text-align: right;
}

.nav-link {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  padding: 1rem;
  border-radius: 0.375rem;
  background-color: white;
  border: 1px solid #dee2e6;
  transition: all 0.2s ease;
  max-width: 300px;
  min-height: 80px;
  position: relative;
  overflow: hidden;
}

.nav-link:hover {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.nav-label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-link:hover .nav-label {
  color: rgba(255, 255, 255, 0.8);
}

.nav-title {
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
  line-height: 1.3;
  word-break: break-word;
}

.nav-link:hover .nav-title {
  color: white;
}

.nav-disabled {
  color: #6c757d;
  font-style: italic;
  padding: 1rem;
  text-align: center;
  background-color: #f1f3f4;
  border-radius: 0.375rem;
  border: 1px solid #e9ecef;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .article-navigation {
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-item {
    justify-content: center;
  }

  .nav-next {
    text-align: center;
  }

  .nav-link {
    max-width: none;
    width: 100%;
  }
}
				`}
			</style>
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
			<nav className="article-navigation">
				<div className="nav-item nav-prev">
					{before ? (
						<Textlink
							href={`/posts/${before}`}
							text={before}
							direction="prev"
						/>
					) : (
						<span className="nav-disabled">この記事が最古です</span>
					)}
				</div>
				<div className="nav-item nav-next">
					{after ? (
						<Textlink href={`/posts/${after}`} text={after} direction="next" />
					) : (
						<span className="nav-disabled">この記事が最新です</span>
					)}
				</div>
			</nav>
		</>
	);
};
function Textlink({
	text,
	href,
	direction,
}: { text: string; href: string; direction: "prev" | "next" }) {
	return (
		<a href={href} className={`nav-link nav-link-${direction}`}>
			<span className="nav-label">
				{direction === "prev" ? "前の記事" : "次の記事"}
			</span>
			<span className="nav-title">
				{direction === "prev" ? "← " : ""}
				{text}
				{direction === "next" ? " →" : ""}
			</span>
		</a>
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
