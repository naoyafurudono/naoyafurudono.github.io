---
title: "Shell Commands"
date: 2022-07-04T13:31:01+09:00
draft: false
---

パーミッションのことが気になって、シェルコマンドのソースコード（C言語）を読んでいるのだけど、読んでいて楽しい。
`rm` から読み始めたのだが `errorno` やコマンド引数の扱い方、トラバース (ftsを使う) の書き方で学びが得られた。
Goのエラーハンドリングの強さが分かる。

なお、パーミッションはコマンドの実装とは分離されているみたいだ。
ファイル削除は `unlinkat` システムコールが実現していて、その前後で権限取得みたいなことは行わない。

次に `chmod` を読んでからシステムコールとOSの話を見にいこう。

- [読んでいるソースコード](https://github.com/naoyafurudono/coreutils)
- [`unlinkat`](https://manpages.ubuntu.com/manpages/bionic/ja/man2/unlink.2.html)
