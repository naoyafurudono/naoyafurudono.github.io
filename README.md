# naoyafurudono.github.io

日記やブログの管理をする。管理対象は以下。

- 記事の原稿 (Markdown)
  - `contents/` で管理
  - 公開先に依存しない
  - Hugoで始めたのでその思想を受け継いでいるかも
- 自作のブログエンジン
  - diary.nfurudono.com, dev.nfurudono.com として公開するサイト
  - 2025年1月時点でアクティブに更新している
  - `tools/tt/` で管理
- diary コマンド
  - 日記の原稿を生成するのに用いる
  - `tools/diary/` で管理
- 記事のデプロイワークフロー
  - CDだけでなくCIも兼ねる
  - `.github/workflows/blog.yml`
    - blog.nfurudono.com: 廃止しました。記事はdiaryやdevで引き続き公開しています。
  - `.github/workflows/dairy.yml`
    - diary.nfurudono.com 
      - `contents/daily/*.md`
    - dev.nfurudono.com 
      - `contents/post/*.md`
  - `.github/workflows/bio.yml`
    - nfurudono.com 
      - `contents/bio/index.html`
      - HTMLをそのまま配信している
- daily コマンド（使うのをやめました、hugoからの脱却の一環です）
  - 日記の原稿を生成・削除・編集するのに用いる
  - `tools/daily/` で管理
- hugoの設定など
  - blog.nfurudono.com として公開していたサイト
  - 2025年8月に更新を停止した
  - 記事テンプレートからの生成のために一部を残している

## ローカル環境

- 日記の生成には diary コマンドを用います。バイナリは `cd tools/diary && go install` で入ります
- 普通の記事を生成するためには `hugo new contents/post/<id>.md` を実行してください。`<id>` は既存のものと被らなければなんでもokです
  - ブログエンジンの実装依存ですが、`<id>` はその記事のURLに含まれます
- typoを検知するために、typosを用いています。pre-commit hookの設定が /.pre-commit-config.yaml にあります。pre-commitをインストールして有効化するとローカルでいい感じになります

## デプロイ環境

GitHub Actionsの設定を見てください
