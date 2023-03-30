---
title: "Hugoでページネーションを無効化"
date: 2022-11-24T15:55:03+09:00
author: "Naoya Furudono"
draft: false
---

[このコミット](https://github.com/naoyafurudono/naoyafurudono.github.io/commit/103975b47aba0b12b6b3fb5ff71caf04b591381d)
でトップページのページネーションを無効化した。
やったことは以下の通り。

- `.Pagenator`を使わないようにする
- 対象のポストを全件表示するようにする
- ページネータを消す

最初の一つが`page/2/`みたいなページ生成を抑止して、次の２つがトップページの見た目を変える。
ページネータを消せば自然に`.Pagenator`を使わないようになるはずだ。

# 参考ドキュメント

- [Hugoは`.Pagenator`の使用をみつけると、`page/2/`みたいなページを生成する](https://gohugo.io/templates/pagination/#configure-pagination)

