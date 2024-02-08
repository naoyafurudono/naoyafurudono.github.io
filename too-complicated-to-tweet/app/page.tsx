import Image from "next/image";
import styles from "./page.module.css";

export default function Landing() {
  return (
    <main className={styles.main}>
      こんにちは！
      <Image src="/thumbnail.png" width={100} height={100} alt="ちんあなごロゴでござる"></Image>
    </main>
  )
}
