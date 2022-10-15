---
title: "エフェクトハンドラと依存性注入の関係について調べる （文献調査）"
date: 2022-10-14T01:59:31+09:00
author: "Naoya Furudono"
draft: false
---

僕はエフェクトハンドラについてそれなりに理解していると思う。
一方で依存性注入についてはふわっとしか知らない。

そんな状態ではあるけれど、
エフェクトハンドラは関数型プログラミングで依存性注入するための
素直な表現に使えるのではないかと感じている。

このポストではネットやアカデミアでどんな議論がありそうかをざっと眺める。
それらの議論の細かいところとか、考察とかは明日以降の意識がはっきりしているときに扱う。

## サーベイ

同じことを思ったひとはいるようで、検索すると[2017年のブログ記事](https://danidiaz.medium.com/free-monads-and-effect-handlers-vs-dependency-injection-bca2eb95e580)がヒットした。
[Hacker Newsのスレ](https://news.ycombinator.com/item?id=20513108)で `chowells`
と `kybernetikos` が同様の議論をしている。これは2019年のこと。

[Jonathan Brachthauser と Daan Leijenの論文](https://www.microsoft.com/en-us/research/publication/programming-with-implicit-values-functions-and-control-or-implicit-functions-dynamic-binding-with-lexical-scoping/)。

エフェクトハンドラの使い方を調べるなら、モナドの使い方を調べるほうが早い気はする。そう思って調べると[良さげなQiitaの記事をみつけた](https://qiita.com/lotz/items/a903d3b2aec0c1d4f3ce#full_moon-extensible-effects)。

まだ列挙したドキュメントをあまり読めていないので、当初知りたかった関係についてはまだよくわかっていない。でも何かしら関係あることは間違いなさそうだし、僕の直感もそんなに的外れではなさそうに思える。
明日起きたら読む。

