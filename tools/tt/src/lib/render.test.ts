import { test, expect } from "vitest";
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
  expect(r.rawBody).include("これはあいさつです。こんにちは")
  expect(r.rawBody).not.include("これはあいさつです。\nこんにちは")
});
