import type { Metadata } from "next";
import Link from "next/link";
import { siteTitle } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: siteTitle,
  description: "これは日記です",
  authors: [
    {
      name: "Naoya Furudono",
      url: "https://nfurudono.com",
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
    { href: "https://nfurudono.com", text: "自己紹介" },
    { href: "/feed.xml", text: "RSS feed (experimental)" },
    { href: "/all", text: "すべての記事" },
    {
      href: "/todos/",
      text: "todos",
    },
    {
      href: "https://zenn.dev/nfurudono",
      text: "最近の技術記事（Zenn、試しに使っています）",
    },
    {
      href: "https://dev.nfurudono.com",
      text: "技術記事",
    },
    {
      href: "https://diary.nfurudono.com",
      text: "日記",
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
