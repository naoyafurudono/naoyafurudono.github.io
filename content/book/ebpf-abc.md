---
title: "読書メモ - eBPF入門"
date: 2023-12-31T23:25:26+09:00
author: "Naoya Furudono"
draft: false
tags:
    - "book"
    - "tool"
---

# 動機

- eBPF面白そうだったので。その目的とかユースケースを知りたかったり、周辺ツールがどういう具合に整備されて使われているかも知りたかった。

# 面白ポイント

- コンテナ横断で情報を取れるのはなるほどなって感じ
- hello worldいつやろうか迷う
    - limaでやるのはつらいのかなと想像しつつ手を動かしていない
    - 帰省していてlinuxマシンが手元にない
    - 本で紹介されている方法は本番ではお勧めできないとか今の所書いてあるし

# 得た知識の使い道

- コンテナ環境をホストするなら監視で使えるかも。いかがわかっていない
  - 何を監視したいのか
  - 何を監視できるのか

# 疑問

- プログラムのサイズを制限しているのは何が目的なんだろう
