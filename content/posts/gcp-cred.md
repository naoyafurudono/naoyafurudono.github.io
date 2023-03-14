---
title: Google Cloudの認証を必要とするアプリケーション開発について
date: 2023-03-14T19:19:56+09:00
author: "Naoya Furudono"
draft: false
tags: [
     "tech"
    ,"tool"
]
---

Google Cloudの認証・認可はきめ細かくちゃんとしている感じがして、扱うのが難しいと感じていた。
少し調べたら[Application Default Credentials with client libraries](https://cloud.google.com/docs/authentication/client-libraries#adc)の説明を見つけて腹に落ちた。
これを抑えた上で、[それぞれの実行環境でどのようにcredentialをセットアップするか](https://cloud.google.com/docs/authentication/provide-credentials-adc#how_to_provide_credentials_to_adc)を見ると、プロセスの権限が半分くらいわかる。ここまでで、サービスアカウントがどのようにプロセスに付与されるかを理解できるはずだ。

次に、それぞれのサービスアカウントがどのようなリソースへのアクセスをもつか、それをどうやって設定するかを確認すれば認証・認可を自由に管理できるんじゃないかと思う。
[How Application Default Credentials works](https://cloud.google.com/docs/authentication/application-default-credentials#personal)が良い水先案内に見える。

このあたりは知識がないと本当に挙動がわけわからないので分かりやすいところにドキュメントを置いといたり、積極的にエラーメッセージで教えてほしい。
Google Cloudを使う上での義務教育だと感じた。

