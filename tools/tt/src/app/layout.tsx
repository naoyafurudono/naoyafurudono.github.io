import { siteTitle } from "@/lib/config";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: siteTitle,
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
/* メインコンテンツの要素に適用されるスタイル */
main [id] {
  border: 2px solid transparent; /* 初期のボーダー */
  transition: all 0.3s ease; /* トランジション効果 */
  cursor: pointer; /* カーソルをポインタにする */
}

main [id]:hover {
  background-color: #f0f0f0; /* 背景色を変更 */
  border-color: #007bff; /* ボーダーの色を変更 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* シャドウを追加 */
}

main [id]:focus {
  outline: none; /* デフォルトのアウトラインを消す */
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5); /* フォーカス時の影を追加 */
}

/* ヘッダーとフッターのスタイリング */
header, footer {
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
  padding: 1rem 0;
  margin: 1rem 0;
}

header {
  border-top: none;
  margin-top: 0;
}

footer {
  border-bottom: none;
  margin-bottom: 0;
}

/* ナビゲーションのスタイリング */
nav {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

nav li {
  margin: 0;
}

nav a {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  text-decoration: none;
  color: #495057;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

nav a:hover {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

nav a:focus {
  outline: 2px solid #0056b3;
  outline-offset: 2px;
}

/* サイトタイトルのスタイリング */
.site-title {
  text-align: center;
  margin-bottom: 1rem;
}

.site-title h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.site-title a {
  color: #007bff;
  text-decoration: none;
  transition: color 0.2s ease;
}

.site-title a:hover {
  color: #0056b3;
  text-decoration: underline;
}

/* メインコンテンツのスタイリング */
main {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  line-height: 1.6;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  nav ul {
    flex-direction: column;
    gap: 0.25rem;
  }

  nav a {
    text-align: center;
  }
}
		`}
			</style>
			<body>
				<header>
					<div className="site-title">
						<h1>
							<Link href="/">{siteTitle}</Link>
						</h1>
					</div>
					<Nav />
				</header>
				<main>{children}</main>
				<footer>
					<Nav />
				</footer>
			</body>
		</html>
	);
}

const Nav = () => {
	const navItems = [
		{ href: "/feed.xml", text: "RSS feed (experimental)" },
		{ href: "/all", text: "すべての記事" },
		{
			href: "/todos/",
			text: "todos",
		},
		{
			href: "https://twitter.com/furudono2",
			text: "書いてる人のTwitter",
		},
		{
			href: "https://zenn.dev/nfurudono",
			text: "最近の技術記事（Zenn、試しに使っています）",
		},
		{
			href: "https://blog.nfurudono.com",
			text: "技術記事",
		},
	];

	return (
		<nav>
			<ul>
				{navItems.map(({ href, text }) => {
					return (
						<li key={href}>
							<Link href={href}>{text}</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};
