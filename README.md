# naoyafurudono.github.io

[ブログ](https://naoyafurudono.github.io/)のソースリポジトリ。
HugoとGitHub Action/Pages におんぶにだっこで実現している。
変更が必要になったらどれかの設定を変えれば良いだろう。

# 記事の追加

## ファイル生成

```
hugo new posts/nice-title.md
```

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

# 今後のこと

あったら便利な機能はたくさんあるけど気張らず行こう。記事が何より大切。
