---
title: "dotfilesのセットアップスクリプトを書いた"
date: 2023-08-17T01:15:56+09:00
author: "Naoya Furudono"
draft: false
tags: [
    "daily"
    ,"tech"
    ,"ubuntu"
    ,"idea"
    ,"tool"
]
---

# 動機

[dotfiles](https://github.com/naoyafurudono/dotfiles/tree/main)をGitHubで管理しているのだが、
今までは設定ファイルの管理だけで、インストールは手動で行なっていた。
設定ファイルを使いまわせるだけでだいぶ便利なんだけど、コンテナ環境の中で作業したくなると、手動インストールに耐えられなくなる。
そこで重い腰を上げてセットアップを自動化した。

# やったこと

## CLI環境のセットアップを簡単にした

`git` のインストールと以下の実行でok。
nvimとかfishとかcargoとかが入る。

```sh
git clone https://github.com/naoyafurudono/dotfiles.git
bash dotfiles/setup.sh
```

## さらに動作確認のためのDockerを用いたテストも書いた

[test](https://github.com/naoyafurudono/dotfiles/tree/main#test)

arm環境かつubuntuだけでしか動かしていないが、dockerコンテナでセットアップスクリプトを動かして、
正常に終了するかを確認するテストを書いた。

# 気になりごと

この手のセットアップスクリプトのテストって、世の中ではどのようにテストしているんだろう。
以下の難しさがテストを大変にしている気がする。

- 環境依存な部分をうまく吸収する必要があること
- インストール失敗の判定が難しいこと
