import { baseUrl } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
