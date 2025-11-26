import os from "node:os";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory",
    concurrency: os.availableParallelism(),
  },
  outDir: "./out",
  vite: {
    ssr: {
      noExternal: ["buffer-crc32"],
    },
  },
});
