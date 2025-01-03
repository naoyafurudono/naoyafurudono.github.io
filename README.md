# naoyafurudono.github.io

日記やブログの管理をする。管理対象は以下。

- 記事の原稿 (Markdown)
  - 公開先に依存しない
  - Hugoで始めたのでその思想を受け継いでいるかも
- hugoの設定など
  - blog.nfurudono.com として公開するサイト
  - 2025年1月時点ではあまり更新してない
- 自作のブログエンジン
  - diary.nfurudono.com として公開するサイト
  - 2025年1月時点でアクティブに更新している
  - `/tools/tt/` で管理
- daily コマンド
  - 日記の原稿を生成・削除・編集するのに用いる
  - `/tools/daily/` で管理
- 記事のデプロイワークフロー
  - CDだけでなくCIも兼ねる
  - blog.nfurudono.com: `.github/workflows/blog.yml`
  - diary.nfurudono.com: `.github/workflows/dairy.yml`
