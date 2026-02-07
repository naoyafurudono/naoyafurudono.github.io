import type { ListItem } from "mdast";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { clearOGPCache } from "./ogp";
import { render } from "./render";

test("改行は取り除かれる", async () => {
  const content = `\
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
  const content = `\
---
title: Hello, world!
date: "2024-08-15"
draft: true
---
# Hello, world!

これはあいさつです。
こんにちは。
    `;
  const r = await render({ content: Buffer.from(content) });
  expect(r.draft).toBeTruthy();
});

test("ドラフトな記事は判定できる: false", async () => {
  const content = `\
---
title: Hello, world!
date: "2024-08-15"
draft: false
---
# Hello, world!

これはあいさつです。
こんにちは。
    `;
  const r = await render({ content: Buffer.from(content) });
  expect(r.draft).toBeFalsy();
});

test("明記がなければドラフトじゃない", async () => {
  const content = `\
---
title: Hello, world!
date: "2024-08-15"
---
# Hello, world!

これはあいさつです。
こんにちは。
    `;
  const r = await render({ content: Buffer.from(content) });
  expect(r.draft).toBeFalsy();
});

test("最初の段落がdescとして取れる", async () => {
  const content = `\
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

test("idをつける", async () => {
  const content = `\
---
title: Hello, world!
date: "2024-08-15"
---
# Hello, world!

これはあいさつです。
こんにちは。

## 日本語でも遊ぶ
    `;
  const r = await render({ content: Buffer.from(content) });
  expect(r.rawBody).toContain('id="hello-world"');
  expect(r.rawBody).toContain('id="日本語でも遊ぶ"');
});

test("h2から始める", async () => {
  const content = `\
---
title: Hello, world!
date: "2024-08-15"
---
# Hello, world!

これはあいさつです。
こんにちは。

## 日本語でも遊ぶ
`;
  const r = await render({ content: Buffer.from(content) });
  expect(r.rawBody).toContain('<h2 id="hello-world"');
  expect(r.rawBody).toContain('<h3 id="日本語でも遊ぶ"');
});

test("tocを生成する", async () => {
  const content = `\
---
title: Hello, world!
date: "2024-08-15"
---
# Hello, world!

これはあいさつです。
こんにちは。

## 日本語でも遊ぶ
`;
  const r = await render({ content: Buffer.from(content) });
  expect(r.toc).toBeTruthy();
  expect(JSON.stringify(r.toc)).toContain("#hello");
});

test("<link>を解釈する", async () => {
  const content = `\
---
title: Hello, world!
date: "2024-08-15"
---
# Hello, world!

<https://example.com>

<badlink.com>

`;
  const r = await render({ content: Buffer.from(content) });
  expect(r.rawBody).include(`href="https://example.com"`);
  // スキーマが必要
  expect(r.rawBody).not.include(`href="badlink.com"`);
});

// OGPカードのテスト
const originalFetch = global.fetch;

beforeEach(() => {
  clearOGPCache();
});

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

test("単独URLはOGPカードに変換される", async () => {
  const mockHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta property="og:title" content="Example Title" />
      <meta property="og:description" content="Example Description" />
      <meta property="og:image" content="https://example.com/image.png" />
    </head>
    <body></body>
    </html>
  `;

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    text: () => Promise.resolve(mockHtml),
  });

  const content = `\
---
title: Test
date: "2024-01-01"
---

https://example.com
`;
  const r = await render({ content: Buffer.from(content) });
  expect(r.rawBody).toContain('class="ogp-card"');
  expect(r.rawBody).toContain('class="ogp-card-title"');
  expect(r.rawBody).toContain("Example Title");
  expect(r.rawBody).toContain("Example Description");
});

test("テキストと混在するリンクはカード化されない", async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    text: () => Promise.resolve("<html><head></head><body></body></html>"),
  });

  const content = `\
---
title: Test
date: "2024-01-01"
---

詳細は https://example.com を参照してください。
`;
  const r = await render({ content: Buffer.from(content) });
  expect(r.rawBody).not.toContain('class="ogp-card"');
  expect(r.rawBody).toContain('href="https://example.com"');
});

test("テキスト付きリンクはカード化されない", async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    text: () => Promise.resolve("<html><head></head><body></body></html>"),
  });

  const content = `\
---
title: Test
date: "2024-01-01"
---

[こちらを参照](https://example.com)
`;
  const r = await render({ content: Buffer.from(content) });
  expect(r.rawBody).not.toContain('class="ogp-card"');
  expect(r.rawBody).toContain('href="https://example.com"');
  expect(r.rawBody).toContain("こちらを参照");
});
