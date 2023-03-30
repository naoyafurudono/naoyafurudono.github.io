---
title: "Phantom Type"
date: 2022-06-29T14:01:56+09:00
draft: false
---

Phantom type (幽霊型) をチラッと学んだのでメモ。
きっかけは [Gentrification gone too far? affordable 2nd-class values for fun and (co-)effect](https://dl.acm.org/doi/10.1145/3022671.2984009) を読んでいるときに出てきたこと。

静的な型を持つ言語で使うテクニックで登場する型（パラメータ）のことをphantom typeという。

```haskell
-- このaがphantom type
data Com a = String

type First ()
type Second ()
type Third ()

init :: String -> Com First 
next :: Com First -> Com Second
final :: Com Second -> Com Third
```

init -> next -> finalの順で呼ぶことになる。それ以外の順番では型検査を通せない。線形型とかGADTとかと組み合わせるともっとリッチなことをできるだろう。
セッションタイプを似たような概念として聞いたことがある。
どのように関係があるのだろうか。

## 追記

[Jane Street のテックブログでphantom typeをYaron Minskyが紹介していた](https://blog.janestreet.com/howto-static-access-control-using-phantom-types/)。
readonly/readwrite/immutableみたいなアクセス制御を実現する方法を例として紹介している。
