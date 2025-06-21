import type { Metadata } from "next";
import { baseUrl } from "@/lib/config";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
