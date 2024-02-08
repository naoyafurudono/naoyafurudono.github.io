import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Landing() {
  return (
    <main className={styles.main}>
      こんにちは！
      <Image src="/thumbnail.png" width={100} height={100} alt="ちんあなごロゴでござる"></Image>
      <div>
        <h2>最新の記事</h2>
        <ol>
          <li>
            <Link href="/hi">初めての記事です</Link>
          </li>
        </ol>
      </div>
    </main>
  )
}
