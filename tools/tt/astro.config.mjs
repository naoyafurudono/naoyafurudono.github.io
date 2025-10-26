import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://diary.nfurudono.com",
  integrations: [mdx(), sitemap()],
  srcDir: "./src-astro",
  outDir: "./dist",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
});
