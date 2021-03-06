---
title: "依存型と副作用"
date: 2022-07-16T15:58:27+09:00
draft: true
---

依存型に副作用を入れる話で、型は純粋な項にしか依存しないみたいな話がある。
その根拠は型はローカルに決まるべき、みたいな信念があるからだそうだ。

その信念は割と妥当なものに感じはするのだけど、
原則は破ってみたくなるものだ。考えてみる。
高度な型推論では大域的にプログラムを見て、ローカルな項に型をつけることがある。
Haskellにはそういう仕組みが入っていたはずだ。 OCamlのweak-polymorphic？みたいな型もそれに関連した考え方だろう。
そういうわけで、大域的に型検査するのも悪くないのではなかろうか。直感的でないことは同意するが、ローカルに決めたいモチベーションは考えることをやめられるほどのしっかりした理由を持たないのではないだろうか。

では、依存型が副作用を持った項に依存できるとすると、なにが嬉しいのだろうか？
`e :: P(get(x))` みたいな項を考えよう。ここで `get` は副作用を起こす関数である。
この `get` の振る舞いは実行時にしか決まらないとすると、`get(x)` は静的に定まらないので `P(get(x))` も（意味のあるケースでは）静的にしか定まらない。
意味の無いというのは、`P = Pi x: Int. Int` とかだと `P(get(x)) = Int` なことが静的にわかってしまうということ。

型検査は静的に行う、という原則を採用すると、型検査の結果が静的には決まらないので不幸せだ。判定はできなくて停止しない、みたいな結論しかだせないだろう。

じゃあ動的に型検査みたいなことをできると思うことにしたらどうだろうか。
コンパイル時に判定できない問題を実行時まで遅延させる方法はコントラクトとして実現できるだろう。いつ型に対応する契約を検査するか判断が必要か。
その項を簡約する直前？ある項が部分項の型をその型の一部として含む場合、「部分型（部分式てきな）」はどのように評価されるべきだろうか。

こういう検査は型として表現したいだろうか？僕はアサーションを使いたいかも知れない。型として扱えることの嬉しさがほしいところだ。
嬉しさが存在しうるかは怪しいと思っている。
型がもたらす良いことは、プログラムの静的な性質の記述なのではないだろうか。
実行時まで検査を遅延して、その嬉しさを捨ててまで型を副作用に依存させたいことはあるのだろうか。

さて、第3の選択肢を考えよう。ローカルではないけど、静的に決まることに依存する型はどうだろう。関数の型が呼び出し文脈を固定すると意味が定まる「副作用」を持つ項に依存するとか。これは型クラスとか、コエフェクトシステムみたいな考え方をすれば自然に解決するだろう。文脈を引数に取る関数を定義したと思えば、その関数はもはや純粋だ。

