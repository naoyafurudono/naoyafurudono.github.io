---
title: "JavaScript The Good Partsを読んだ"
date: 2022-06-20T19:55:28+09:00
draft: false
---

読んだ。きっかけはTypeScriptの関数型言語好き向けの紹介ページで事前知識として要求されていたから。
読んでよかったと思う。しっかりJSの知れたのではないかと（その判定はまだできないが）。
とはいえまだまだ知るべきGood Partsはある気がする、
というのも`const`とか`let`が説明されていないので、情報が古いだろうと感じたから。
プロトタイプの話が載っていたり、thisの動的な意味の変化のこととか、
`var`のスコープとかを説得力をもって説明してくれたのはとてもありがたい。
そういう点で読んでよかったと思う。DOMやevent handlerなど、ブラウザ周りの話を知りたい。

JSがSchemeに近い部分があることを知られて良かったと思う（Schemeのletがあればどんなに幸せだろうと思うけど）。
JSには偏見しかなかったけど、良い言語に思えてきた。TypeScriptも知りたい。DOMとevent handlerが先だが。
UIを扱うにはJSが強い？C# with Unityもあるのか？
TSよりも関心はDOMやevent handlerにある。

## 追記

JSの`let`を勉強している。[MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/let)。
`var`が作るスコープがレキシカルスコープではないことは既に知っている。
`let`はマシだが、SchemeとかOCamlで期待するような感じにはならない。[MDN 一時的なデットゾーン](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone)で解説されている。
MDNでも触れられているが、`let`の右側（`let x = <ここ>`）が常にこのletが作るスコープに所属することになる。
なので、常に束縛する変数と同じ名前は`let`の右側には出現できない（`let x = x.foo`は常にエラー）。
その他に、同じブロックに同じ変数に対する`let`を複数回使えない。シャドーイングが不便。
これらはすべて良くないとは思うが、そんなに大きな問題でも無い気はする。

`let`の仕様によって、JSでブロックを使う意味が生まれた？[^fn] `switch`でそれぞれのブランチのスコープを区切るためにブロックを使うテクニックが紹介されている。

[^fn]この疑問符は、他の用法はあったのだろうか、という意図。

