---
title: "Local File Transfer"
date: 2022-07-14T14:02:57+09:00
author: "Naoya Furudono"
draft: false
tags: ["idea"]
---

近距離でのファイル交換はあまり洗練されていない印象がある。
Apple製品間ではAirdropが使えるし、Windowsにも似たような機能があったはずだ。
でも汎用的に（たとえばOSを気にせずに）使える機能は見かけない。
そういうときにはGoogle DriveやDropBoxみたいなクラウドサービスを使うか、USBメモリを使うのが一般的だろう。
Slackとかメールに頼ることもある。

インターネットに頼るのは不便だし、USBメモリが刺さらないデバイスも多い。
Blootoothを基本の通信方式として、それが使えない場合にインターネットを経由するのはいかがだろうか。

通信技術は既存手法を組み合わせるだけで良いだろう。難しいことはないだろう。
一方でアプリケーションのUIには工夫が必要なのではないだろうか。

- どこにファイルを保存するか
- OS間でのファイルの互換性
- 送信先の選択
- 受信の制御

これらの選択に一般的な回答は存在するだろうか？
他のアプリに組み込む形がよいかもしれない。
例えばローカルの会議で各自が自身のPCで文書や画像、図面などを編集するアプリがあったとして、
参加者間でのデータ共有のために今考えているものを使う。
このときUIはアプリの特性から決まるだろう。

この例に対して、スマホやPCのファイルシステムは一般的すぎて設定を決め打ちできないのではないだろうか。
そうすると、ファイル共有の実行時にユーザが設定をあたえることになる。大変不便だろう。

設定ファイルの編集やディスパッチの機能をつければ楽になるか？
ルールエンジンとかは大げさだろうか。
