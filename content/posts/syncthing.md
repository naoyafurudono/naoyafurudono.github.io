---
title: "Syncthingがよさげ"
date: 2022-09-28T16:25:18+09:00
author: "Naoya Furudono"
draft: false
---

オープンソースのソフトウェアで[Syncthing](https://docs.syncthing.net/intro/getting-started.html)
というものを知った。
LAN内のデバイスとはLAN内で、インターネットの先にいるデバイスとはインターネット越しにファイルを同期できるソフトウェアだ。
予めクライアントをインストールして、ディレクトリごとに共有設定をしておくと、
設定に応じてよしなにファイルを同期してくれる。

USBのような手軽さはないが、クラウドストレージ越しにファイルのやりとりをするよりは便利そうだ。
UbuntuとAndroidにクライアントを入れてつかってみているのだけど、今の所いいかんじ。
学校のネットワークではP2P通信を禁止している。
おそらくSyncthingも引っかかるので、学校のネットワークでは動作しないように設定しておく。

設定は公式に従ってもよいし、[このブログポスト](https://virment.com/how-to-use-syncthing-for-syncing-local-files/)も参考になる。
詳しいことは[ArchWiki](https://wiki.archlinux.jp/index.php/Syncthing)が頼りになりそう。

