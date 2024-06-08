---
title: "Go Conference 2024に参加した"
date: 2024-06-08T15:14:03+09:00
author: "Naoya Furudono"
draft: false
tags:
    - "daily"
    - "PL"
    - "tech"
---

# 参加セッション
 
Openingから全ての時間帯で参加した。
参加セッションは以下の通り。

- [イテレータによってGoはどう変わるのか]()
    - 最近入ったイテレータの紹介
    - 楽しみ。イテレータ使うようなコード書いていきたいな
    - Pythonのジェネレータみたいなノリで使うケースとか出てくるのかな。遅延させてメモリとかを節約する用途
    - その後感想戦で[samber/lo](https://github.com/samber/lo)を小山さんに教わった。欲しかったけどGoはそういうものだと諦めてたのものがあった
- [Dive into gomock](https://gocon.jp/2024/sessions/1/)
    - gomockの機能をざっと見て知らない機能が多いことを知った
    - 実装の詳細に入っていくのが本題で、これがreflectionか、という感じ
    - gomockの見る目が変わった
- [Data Race Detection In Go From Beginners Eye](https://gocon.jp/2024/sessions/5/)
    - happens beforeとか聞いたことあったが、何も知らなかった。
    - vector clockなるほどなという感じ。シンプルで賢い。
    - `-race` オプションを指定したときに挿入されるディレクティブ、網羅的にするの大変じゃないのかな。どういう判定の仕方をしているのだろう。
    - <https://go.dev/doc/articles/race_detector>
    - <https://github.com/97vaibhav/Go-Conference-2024-Tokyo>
- [Custom logging with slog: Making Logging Fun Again!](https://gocon.jp/2024/sessions/4/)
    - slogの使い方やアーキテクチャと、カスタマイズのデモの構成
    - slog何も知らなかったのだなの気持ち
    - slogで遊ぶの楽しそう
    - slogのインターフェイスで運用改善とかしたい
        - それが健全かは怪しいかもだが
    - <https://github.com/masumomo/go-conference2024-slog-samples>
- カミナシのスポンサーセッション
    - 複数サービスにまたがる認証機能実装のテストの動かし方。dockettestとlocalstackを使うソリューションをきいた。メールとかAWSのdynamo DB,Lambdaが絡んだ機能をうまくシュッとローカルでテストできるようにした話。
- [GoのLanguage Server Protocol実装、「gopls」の自動補完の仕組みを学ぶ](https://gocon.jp/2024/sessions/8/)
    - goplsのアーキテクチャとか他のツールとの関係性とか
    - その他補完候補重み付けなど
- [試してわかるGo ModulesとMinimal Version Selection]()
    - go-patch、マクロみたいな感じで気になる
    - 厳しいケース、確かに。そもそもコンパイルできる形で両立できなさそうなので、エラーで落としてfeature flagでの対応を諦めるのがいいのかな。
    - というかそもそもそんなにがっつりfeature flag使うスタンスなのすごい
- [Guide to Profile-Guided Optimization: inlining, devirtualining, and profiling]()
    - Profile guided optimizaton知らなかった
    - Datadogにプロファイル送っておくのなるほど
    - 実際パフォーマンスがどう変わったか気になる
- [DELISH KITCHENにおけるマスタデータのキャッシュ戦略とその歴史的変遷](https://gocon.jp/2024/sessions/23/)

# さっと使いたい知見

`go` の `-race` オプションとslogの導入はシュッと活用できそう。gomockもかな。
他もじんわり効いてきそうで知見〜という感じ。

# メモ

- [GoConference2024の資料が集まるスレ](https://zenn.dev/miyataka/scraps/cc37aa7918944f)

