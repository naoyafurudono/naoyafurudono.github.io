---
title: "Ubuntu22でスクリーンショットの保存先を変える方法"
date: 2022-09-11T19:09:03+09:00
author: "Naoya Furudono"
draft: false
---

Ubuntu22でデフォルトのスクリーンショットアプリはおしゃれな見た目をしていてかっこいいのだが、保存先を変える設定が見当たらなくて困っていた。
デフォルトでは `~/Picture/スクリーンショット/` に保存されるのだが、`~/Desktop/` に保存されてほしいのだ。

[StackExchange](https://askubuntu.com/questions/1408611/changing-the-auto-save-directory-for-screen-shots-and-screen-cast-in-ubuntu-22-0)に回答があった。
回答によると、やはり残念ながらユーザによる設定はできないようで、シンボリックリンクを張る手法が提案されていた。
僕もそれに倣ったら具合が良いのでリンクをメモしておく。

別の解決方法として、[`gnome-schreenshot` をインストールして使う方法](https://askubuntu.com/questions/1403994/how-to-change-the-default-screenshot-folder-in-gnome-42/1428765#1428765)
もあるようだ。
しっかり読んでいないのだが、やることが多くて面倒にみえる。

