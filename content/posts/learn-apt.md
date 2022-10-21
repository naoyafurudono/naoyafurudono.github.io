---
title: "aptのドキュメント整理"
date: 2022-10-22T00:51:48+09:00
author: "Naoya Furudono"
draft: false
---

雰囲気でaptを使っていて、リポジトリ周りの扱いに困ることがある。
この手のツールは一生使うだろうから勉強して損はないだろう。
この記事には読んだドキュメントと一言コメントを残しておく。

- [apt(man)](https://manpages.ubuntu.com/manpages/bionic/ja/man8/apt.8.html)
  - 意図的に情報を絞っているとのこと。数分で読み切れる。
  - ざっくりと概念をつかめた気がする。
  - 次の課題はリポジトリ
- [sources.list(man)](https://manpages.ubuntu.com/manpages/bionic/ja/man5/sources.list.5.html)
  - リポジトリのリスト。aptが参照/手入れする。こういう名前のファイルがあるし、似たようなディレクトリもある。それらの総称として`sources.list`と呼んでいる節がありそう。
  - [くじらにっき++](https://kujira16.hateblo.jp/entry/2019/10/14/190008)がやさしい

これでざっくりわかった。次にセキュリティのことを調べる。
というのも、aptが失敗するのはセキュリティ周りの設定がうまくいっていないことが原因なことが多く感じるから。

- [apt-secure(man)](https://manpages.ubuntu.com/manpages/kinetic/ja/man8/apt-secure.8.html)
  - ここで、apt-keyで鍵を登録すると書かれているが、この方法は非推奨になっている（[apt-key](https://manpages.ubuntu.com/manpages/kinetic/en/man8/apt-key.8.html)）。
    - [gihyoに解説記事](https://gihyo.jp/admin/serial/01/ubuntu-recipe/0675)がある
    - 代替ツールはなくて、manでは直接ディレクトリに鍵ファイルを放り込むことが推奨されている。

トラブルが起こったらこのあたりをいじればよさそうだ。
apt経由でインストールする際のおまじないの意味もわかるようになった。
確かSlackをaptでインストールした際にリポジトリや鍵を追加したはずなのだが、当時はよくわかっていなかった。

