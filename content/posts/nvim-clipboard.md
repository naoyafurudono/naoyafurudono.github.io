---
title: "NeoVimでクリップボードを使う"
date: 2022-06-12T11:01:45+09:00
draft: false
---

# NeoVimでクリップボードを使う

## TL;DR;

`init.vim`に`set clipboard+=unnamedplus`と追記する。

## 長めの説明

Nvimでは（viやvimも）ヤンクやペーストで、nvimが管理するバッファを記憶領域として用いる。
なのでクリップボードとは分離されていて不便なことが多い。

バッファとクリップボードをつなげれば良くて、その設定は上のコマンドで完結するようだ。
ネットの記事には裏で`pbcopy`やそれに類するものの設定が必要、みたいなことをいう記事があるが
手元の環境では上の１行を追加するだけで良かった。

```
:version                                                                                                                                 
NVIM v0.6.1
Build type: Release
LuaJIT 2.1.0-beta3
Compiled by team+vim@tracker.debian.org
```

[該当コミット](https://github.com/naoyafurudono/nvim-config/commit/23b1e25099abd81a096f4719c7c2d11629f725d7)：関係無い変更も同時にコミットしてる...。

複数のnvimプロセス間でクリップボードを共有できる（当然）のが地味に便利。
（普通は複数プロセス立てない？）

