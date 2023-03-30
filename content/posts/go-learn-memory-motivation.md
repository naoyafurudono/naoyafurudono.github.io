---
title: "Golang の変数キャプチャ"
date: 2022-06-28T17:27:34+09:00
draft: false 
---

Golangの変数キャプチャを勉強する。

追記: 最初、変数キャプチャではなくメモリモデルを勉強しようとしていた。勉強してみて、求めている概念では無いことに気がついたのでタイトルなどを修正した。
メモリモデル自体は知れて良かった。非同期処理へのコンパイラ最適化が及ぼす影響を知れる（[公式サイト](https://go.dev/ref/mem) におせわになった）。
変数キャプチャの説明は[これ](https://eli.thegreenplace.net/2019/go-internals-capturing-loop-variables-in-closures/) を読む。３年前に僕と同じことを思ったひとがいたようだ。

# Overview

クロージャをforループ内で生成してデータ構造や高階関数に渡すような処理を書いた。
そこで変数の扱い（メモリモデル）でエラーを出したことがことの始まり。
解決策はシンプルなのだが、イマイチしっくりこないので勉強したくなった。
クロージャの変数キャプチャは言語によりけりだし、特徴が現れるように思う。
Golangがどうなっているか知るのが楽しみ。

# 動機となったミス

問題のコードはこんな感じ
[(The Go Playground)](https://go.dev/play/p/unayMJyn_3g)。

```go
words := []string{"foo", "boo", "bang"}
arr := []func(){}

for i, elem := range words {
	arr = append(arr, func() {
		fmt.Printf("%d: %s\n", i, elem)
	})
}

for _, f := range arr {
	f()
}
```

結果は次の通り。

```
2: bang
2: bang
2: bang
```

期待していたのはこれ。

```
0: foo
1: boo
2: bang
```

こうすると期待通りの出力を得られる
[(The Go Playground)](https://go.dev/play/p/xO9C4G03a0k)。

```go
words := []string{"foo", "boo", "bang"}
arr := []func(){}

for i, elem := range words {
	i := i
	elem := elem
	arr = append(arr, func() {
		fmt.Printf("%d: %s\n", i, elem)
	})
}

for _, f := range arr {
	f()
}
```

# 理解

どういう理屈で振る舞いが変わったのだろうか？一般的な理屈が知りたい。
２つの要素がある。for文のスコープとクロージャの変数束縛だ。

## for 文のスコープ

[言語仕様 (`range`つきfor文)](https://go.dev/ref/spec#For_range) によると、`range` 節を伴ったfor文では、宣言した変数が使い回されるらしい。

> The iteration variables may be declared by the "range" clause using a form of short variable declaration (:=). In this case their types are set to the types of the respective iteration values and their scope is the block of the "for" statement; they are re-used in each iteration. If the iteration variables are declared outside the "for" statement, after execution their values will be those of the last iteration.

## クロージャの変数束縛

[言語仕様 (関数リテラル)](https://go.dev/ref/spec#Function_literals)
によると関数リテラル（クロージャ）は定義もとの変数を共有するとのこと。

> Function literals are closures: they may refer to variables defined in a surrounding function. Those variables are then shared between the surrounding function and the function literal, and they survive as long as they are accessible.

## 問題の説明

最初の例では、forループで宣言された変数 `i` をすべての関数リテラルが共有した。
最初のforループが終わったあとの変数 `i` の値は最後の繰り返しでの値になる。なのですべて 2: bang` と表示した。

２つ目の例では、forループの中で、毎回変数 `i` を宣言、定義した。for文が代入する変数`i`は、for文がイテレーションで定義したものではなく、はじめに定義したものなのでそれぞれのクロージャは影響を受けない（クロージャはfor文の各繰り返しのブロックと変数を共有するが、ブロックはすぐに終了してそれぞれのクロージャだけが変数にアクセスしうるようになる）。
したがってそれぞれのクロージャは別々の値をプリントする。

# あとがき

すっきりした。嬉しい。

GolangのキャプチャはC++の参照キャプチャと思ってよさそうだろうか。
クロージャの側は多分良いけど、変数の生存期間が違うので類推しないのが安全か。

言語の理解が進むとその言語をもっと好きになるみたいだ。

