import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "日記",
	description: "これは日記です",
	authors: [
		{
			name: "Naoya Furudono",
			url: "https://blog.nfurudono.com/profile/",
		},
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<style>
				{`
/* 基本スタイル */
[id] {
  border: 2px solid transparent; /* 初期のボーダー */
  transition: all 0.3s ease; /* トランジション効果 */
  cursor: pointer; /* カーソルをポインタにする */
}

/* ホバー時のスタイル */
[id]:hover {
  background-color: #f0f0f0; /* 背景色を変更 */
  border-color: #007bff; /* ボーダーの色を変更 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* シャドウを追加 */
}

/* フォーカス時のスタイル */
[id]:focus {
  outline: none; /* デフォルトのアウトラインを消す */
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5); /* フォーカス時の影を追加 */
}
		`}
			</style>
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
								{
									href: "/todos/",
									text: "todos",
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
