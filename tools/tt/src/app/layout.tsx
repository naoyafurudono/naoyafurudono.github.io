import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "ブログ",
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
							{[
								{ href: "/", text: "ホーム" },
								{
									href: "https://twitter.com/furudono2",
									text: "書いてる人のTwitter",
								},
							].map(({ href, text }) => {
								return (
									<li key={href}>
										<Link href={href}>{text}</Link>
									</li>
								);
							})}
						</ul>
					</nav>
				</footer>
			</body>
		</html>
	);
}
