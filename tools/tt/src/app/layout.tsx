import type { Metadata } from "next";

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
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
