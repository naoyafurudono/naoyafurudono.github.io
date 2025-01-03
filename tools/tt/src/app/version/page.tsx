import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Current Commit Hash",
	description: "Displays the commit hash of the current build",
};

export default function Home() {
	const commitHash = process.env.COMMIT_HASH || "unknown";

	return (
		<main>
			<p>
				commit hash:
				<span id="hash">{commitHash}</span>
			</p>
		</main>
	);
}
