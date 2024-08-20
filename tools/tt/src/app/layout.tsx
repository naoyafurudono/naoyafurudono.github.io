import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "ブログです",
	description: "ブログです",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body>
				<header>
					<nav>
						<p>
							<Link href="/">diary.nfurudono.com</Link>
						</p>
					</nav>
				</header>
				<main>{children}</main>
				<footer>
					<nav>
						<ul>
							{[{ path: "/", text: "ホーム" }].map(({ path, text }) => {
								return (
									<li key={path}>
										<Link href={path}>{text}</Link>
									</li>
								);
							})}
							<Link href="https://twitter.com/furudono2">書いてる人のTwitter</Link>
						</ul>
					</nav>
				</footer>
			</body>
		</html>
	);
}
