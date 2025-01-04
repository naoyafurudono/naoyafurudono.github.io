import { commitHash } from "@/lib/config";
import type { Metadata } from "next";

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
