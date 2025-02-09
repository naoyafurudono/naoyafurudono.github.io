import { baseUrl } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
};
