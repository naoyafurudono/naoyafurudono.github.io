import type { NextPage } from "next";
import { useEffect, useState } from "react";

type Props = {
	params: {
		id: string;
	};
};
const Home: NextPage<Props> = async () => {
	return (
		<>
			<h1>ツイートするには長すぎる</h1>
			<div />
		</>
	);
};
export default Home;

// type SummaryProps = {
// 	article: Article;
// };
// const ArticleSummary = ({ article }: SummaryProps) => {
// 	return (
// 		<article>
// 			<h1>{article.title}</h1>
// 		</article>
// 	);
// };
