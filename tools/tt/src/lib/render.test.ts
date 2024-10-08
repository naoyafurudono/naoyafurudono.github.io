import type { ListItem } from "mdast";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { expect, test } from "vitest";
import { render, renderMdAst } from "./render";

test("改行は取り除かれる", async () => {
	const content = `
---
title: Hello, world!
date: "2024-08-15"
---
# Hello, world!

これはあいさつです。
こんにちは。
    `;
	const r = await render({ content: Buffer.from(content) });
	expect(r.rawBody).include("これはあいさつです。こんにちは");
	expect(r.rawBody).not.include("これはあいさつです。\nこんにちは");
});

test("ドラフトな記事は判定できる", async () => {
	const content = `
---
title: Hello, world!
date: "2024-08-15"
drafat: true
---
# Hello, world!

これはあいさつです。
こんにちは。
    `;
	const r = await render({ content: Buffer.from(content) });
	expect(r.draft).toBeTruthy;
});

test("明記がなければドラフトじゃない", async () => {
	const content = `
---
title: Hello, world!
date: "2024-08-15"
---
# Hello, world!

これはあいさつです。
こんにちは。
    `;
	const r = await render({ content: Buffer.from(content) });
	expect(r.draft).toBeFalsy;
});

test("最初の段落がdescとして取れる", async () => {
	const content = `
 ---
 title: Hello, world!
 date: "2024-08-15"
 ---
 # Hello, world!

 これはあいさつです。
 こんにちは。
     `;
	const r = await render({ content: Buffer.from(content) });
	expect(r.desc).include("こんにちは");
});

test("todoを抽出する", async () => {
	const content = `\
---
title: Hello, world!
date: "2024-08-15"
---

# Hello, world!

- [ ] これはあいさつです。
- [x] doneです
- [ ] todoです
`;
	const r = await render({ content: Buffer.from(content) });
	expect(r.unchecked).toHaveLength(2);
	const first: ListItem = r.unchecked[0];
	expect(JSON.stringify(first)).toContain("これはあいさつです。");
	const second: ListItem = r.unchecked[1];
	expect(JSON.stringify(second)).toContain("todoです");
});

test("レンダリングする", async () => {
	const content = `\
---
title: Hello, world!
date: "2024-08-15"
---
# Hello, world!

これはあいさつです。
こんにちは。
    `;
	const root = unified().use(remarkParse).use(remarkFrontmatter).parse(content);

	const s = await renderMdAst(root);
	expect(s).toContain("<h1>Hello, world!</h1>");
});
