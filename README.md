# naoyafurudono.github.io

<a target="_blank" rel="noopener noreferrer" href="https://github.com/naoyafurudono/naoyafurudono.github.io/actions">
<img src="https://github.com/naoyafurudono/naoyafurudono.github.io/actions/workflows/gh-pages.yml/badge.svg" alt="github pages deploy status" style="max-width: 100%;">
</a>

[ブログ](https://naoyafurudono.github.io/)のソースリポジトリ。
[HugoとGitHub Actions/Pages におんぶにだっこで実現している](https://blog.nfurudono.com/posts/2022/march/my-first-post/)。
変更が必要になったらどれかの設定を変えれば良いだろう。

# 記事の追加

## ファイル生成

普通の記事作成と日記の作成で推奨する方法がことなる。
普通の記事作成では`hugo`を直接たたく：

```
hugo new posts/nice-title.md
```

### dailyコマンド

日記の作成では`daily`コマンドが便利。タイトルとかディレクトリ配置をいい感じに設定してファイルを作成し、
`nvim`でファイルを開く。僕しか記事を書かないだろうからエディタは固定。

#### 追記

- 2023-05-13: [rustで書き直してみた](https://github.com/naoyafurudono/naoyafurudono.github.io/commit/5dffad6d10406fa83c4d9dd8eaa91a3c769a553f)。
機能も追加してもっと便利になりました！ Try `./gen_daily && ./daily -h` !

## 公開

フロントマターの`draft`を`false`にした上で`main`ブランチに`push`する。

こんな感じ：

```
----
title: "ブログの設定を変えた"
date: 2022-05-30T02:08:10+09:00
draft: false
---
```

## todos

- [ ] `dev` を `blog` から切り出す
  - このサイトを日記、新しい方を開発関係にする
