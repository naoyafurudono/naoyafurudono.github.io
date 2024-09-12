import { expect, test } from "vitest";
import { render } from "./render";

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
