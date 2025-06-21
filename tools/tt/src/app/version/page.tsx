import type { Metadata } from "next";
import { commitHash } from "@/lib/config";

export const metadata: Metadata = {
	title: "Current Commit Hash",
	description: "Displays the commit hash of the current build",
};

export default function Home() {
	return (
		<main>
			<p>
				commit hash:
				<span id="hash">{commitHash}</span>
			</p>
		</main>
	);
}
