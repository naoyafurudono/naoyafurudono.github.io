---
title: "Golang のメモリモデルを勉強する宣言"
date: 2022-06-28T17:27:34+09:00
draft: false 
---

Golangのメモリモデルを勉強する（宣言は以上）。ここではそのモチベーションを書く。
勉強したらそのメモを別のページにあげて、このページと相互リンクする。

## Overview

クロージャをforループ内で生成してデータ構造や高階関数に渡すような処理を書いた。
そこで変数の扱い（メモリモデル）でエラーを出したことがことの始まり。
解決策はシンプルなのだが、イマイチしっくりこないので勉強したくなった。
クロージャの変数キャプチャは言語によりけりだし、特徴が現れるように思う。
Golangがどうなっているか知るのが楽しみ。

## 動機となったミス

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

どういう理屈で振る舞いが変わったのだろうか？一般的な理屈が知りたい。

