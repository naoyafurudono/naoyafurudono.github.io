import { fromText } from "@/models/markdown"
import { Md } from "../_components/markdown"

export default function Article() {
  return (
    <Md markdown={fromText(content)}></Md>
  )
}

const content = `\
# するにはこんがらがらがらがっている

## こんにちは

このブログは開発中ではあるのですが、まあぼちぼち運用もしていきます。単にテスト用のコンテンツを並べるだけではなく、記事も書いていきたいと思っているのです。
とはいえ見やすさの考慮は全くしませんし、コンテンツの品質も保証しません。まあ、そんな感じでお楽しみください。

たまにChatGPTやCopilotが書いた文章も混じるでしょう。細かいことは気にしてはいけません。それではまた。\
`