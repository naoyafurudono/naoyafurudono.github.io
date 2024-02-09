import styles from "@/app/page.module.css";
export default function Article() {
  return (
    <main className={styles.main}>
      <h1>するにはこんがらがらがらがっている</h1>
      <article className={styles.grid}>
        <h2>こんにちは</h2>
        <p>
          このブログは開発中ではあるのですが、まあぼちぼち運用もしていきます。単にテスト用のコンテンツを並べるだけではなく、記事も書いていきたいと思っているのです。
          とはいえ見やすさの考慮は全くしませんし、コンテンツの品質も保証しません。まあ、そんな感じでお楽しみください。
        </p>
        <p>
          たまにChatGPTやCopilotが書いた文章も混じるでしょう。細かいことは気にしてはいけません。それではまた。
        </p>
      </article>
    </main>
  )
}