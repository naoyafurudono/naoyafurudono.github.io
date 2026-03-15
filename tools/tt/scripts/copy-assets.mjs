import fs from "node:fs";
import path from "node:path";

const args = process.argv[2];
if (!args) {
  console.error("Usage: node copy-assets.mjs <content-dir>[,<content-dir>,...]");
  process.exit(1);
}

const contentDirs = args.split(",").map((d) => d.trim());
const outputBase = path.join(import.meta.dirname, "..", "public", "posts");

// Clean output directory to prevent stale files
if (fs.existsSync(outputBase)) {
  fs.rmSync(outputBase, { recursive: true });
}

let copied = 0;

for (const contentDir of contentDirs) {
  const resolved = path.resolve(contentDir);
  if (!fs.existsSync(resolved)) {
    console.warn(`Content directory not found: ${resolved}`);
    continue;
  }

  const entries = fs.readdirSync(resolved, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const articleDir = path.join(resolved, entry.name);
    const files = fs.readdirSync(articleDir, { withFileTypes: true });
    const assets = files.filter((f) => f.isFile() && !f.name.endsWith(".md"));

    if (assets.length === 0) continue;

    const destDir = path.join(outputBase, entry.name);
    fs.mkdirSync(destDir, { recursive: true });

    for (const asset of assets) {
      fs.copyFileSync(path.join(articleDir, asset.name), path.join(destDir, asset.name));
      copied++;
    }
  }
}

console.log(`Copied ${copied} asset(s) to ${outputBase}`);
