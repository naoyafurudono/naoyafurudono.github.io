import { expect, test } from "vitest";
import { Markdown, fromText } from ".";

const sample: Markdown = [
  {
    type: "heading",
    level: 1,
    text: "ツイートするにはこんがらがらがらがっている"
  },
  {
    type: "heading",
    level: 2,
    text: "こんにちは"
  },
  {
    type: "paragraph",
    text: `このブログは開発中ではあるのですが、まあぼちぼち運用もしていきます。単にテスト用のコンテンツを並べるだけではなく、記事も書いていきたいと思っているのです。
    とはいえ見やすさの考慮は全くしませんし、コンテンツの品質も保証しません。まあ、そんな感じでお楽しみください。`
  },
  {
    type: "paragraph",
    text: "たまにChatGPTやCopilotが書いた文章も混じるでしょう。細かいことは気にしてはいけません。それではまた。"
  }
]

const sampleText = `
# ツイートするにはこんがらがらがらがっている

## こんにちは

このブログは開発中ではあるのですが、まあぼちぼち運用もしていきます。単にテスト用のコンテンツを並べるだけではなく、記事も書いていきたいと思っているのです。
とはいえ見やすさの考慮は全くしませんし、コンテンツの品質も保証しません。まあ、そんな感じでお楽しみください。

たまにChatGPTやCopilotが書いた文章も混じるでしょう。細かいことは気にしてはいけません。それではまた。
`

// test("fromText", () => {
//   expect(fromText(sampleText)).toEqual(sample)
// })

test("simple text", () => {
  const text = "hello"
  expect(fromText(text)).toEqual([{ type: "paragraph", text }])
})

test("simple heading", () => {
  const text = "# hello"
  expect(fromText(text)).toEqual([{ type: "heading", level: 1, text: "hello" }])
})