import { articleDirectoryPaths } from "@/lib/config";
import { type ArticleID, findArticle, listArticles } from "@/lib/gateway";
import { ImageResponse } from "next/og";

// Image metadata
export const alt = "About Acme";
export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image({ params }: { params: { id: string } }) {
	const { id } = params;
	const a = await findArticle({
		articleId: id as ArticleID,
		directoryPaths: articleDirectoryPaths,
	});
	if (!a) {
		throw new Error(`Not found: ${id}`);
	}

	return new ImageResponse(
		// ImageResponse JSX element
		<div
			style={{
				fontSize: 128,
				background: "white",
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{a.desc || a.title}
		</div>,
		// ImageResponse options
		{
			// For convenience, we can re-use the exported opengraph-image
			// size config to also set the ImageResponse's width and height.
			...size,
		},
	);
}

export async function generateStaticParams() {
	const as = await listArticles(articleDirectoryPaths);
	return as.map((a) => ({ id: a.id }));
}
