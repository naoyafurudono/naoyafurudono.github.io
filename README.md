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
  - `.github/workflows/blog.yml`
    - blog.nfurudono.com: いずれ廃止します。コンテンツが完全に変わって生まれ変わるかも知れません
  - `.github/workflows/dairy.yml`
    - diary.nfurudono.com 
      - `contents/daily/*.md`
    - dev.nfurudono.com 
      - `contents/post/*.md`

## ローカル環境

- 日記の生成には /daily コマンドを用います。バイナリは /gen-daily で生成できます。gen-dailyの実行にはcargoが必要です
- 普通の記事を生成するためには `hugo new contents/post/<id>.md` を実行してください。`<id>` は既存のものと被らなければなんでもokです
  - ブログエンジンの実装依存ですが、`<id>` はその記事のURLに含まれます
- typoを検知するために、typosを用いています。pre-commit hookの設定が /.pre-commit-config.yaml にあります。pre-commitをインストールして有効化するとローカルでいい感じになります

## デプロイ環境

GitHub Actionsの設定を見てください
