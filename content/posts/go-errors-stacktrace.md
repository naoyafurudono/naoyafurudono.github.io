---
title: "漏れなくスタックトレースをGoで取りたい！"
date: 2025-01-08T00:12:35+09:00
author: "Naoya Furudono"
draft: false
tags:
    - "PL"
    - "tech"
---

[k1LoW/errors](https://github.com/k1LoW/errors) でスタックトレースをエラーにつけられるようになる。
便利なのだがトレースをプログラマが明示的に指示しないといけない。設定をコードベースで一回やれば終わりではなく、エラーの発生源で書かないといけない点が気になっている。
書くこと自体は許容しているが、漏れがないように人間が頑張るのは許容したくない。
漏れをなくすための仕組みを考える。

# k1LoW/errorsの説明

ライブラリとして使うためにはreadmeの説明で十分だと思うが、議論のためにここでも説明する。
以下のように用いる。

<https://go.dev/play/p/Cwp4n-vZONv>

```go
package main

import (
	"encoding/json"

	"github.com/k1LoW/errors"
)

func f() error {
	// このようにWithStackを呼び出した箇所でのスタックトレースがerrorオブジェクトに記録される
	return errors.WithStack(errors.New("ouch!")) // ここは11行目
}

func main() {
	err := f()
	// スタックトレースを含んだエラー内容をフォーマットする
	s := errors.StackTraces(err)
	b, _ := json.Marshal(s)
	println(string(b))
}
```

実行すると以下のような出力が得られる。見やすさのために jq にかませてフォーマットした。

```json
[
  {
    "error": "ouch!",
    "frames": [
      {
        "name": "main.f",
        "file": "/tmp/sandbox123757503/prog.go",
        "line": 11
      },
      {
        "name": "main.main",
        "file": "/tmp/sandbox123757503/prog.go",
        "line": 15
      },
      {
        "name": "runtime.main",
        "file": "/usr/local/go-faketime/src/runtime/proc.go",
        "line": 272
      },
      {
        "name": "runtime.goexit",
        "file": "/usr/local/go-faketime/src/runtime/asm_amd64.s",
        "line": 1700
      }
    ]
  }
]
```

スタックトレースの先頭 (frames配列の先頭要素) はWithStackを呼び出した位置を指す。

したがって、アプリケーションの中でのエラーの発生源をスタックトレースから漏れなく特定するためには、**エラーの発生源の全てでWithStackを呼び出す必要がある**。

なお、WithStackを重ねて呼び出しても問題ようになっている（深いスタックトレースを持つものが生き残るようになっているし、他のも気遣いがされている）。

# 背景・既存のアイデア

[名前付き返り値とdeferを使って忘れないようにする手法も紹介されている](https://k1low.hatenablog.com/entry/2024/08/13/083000)。

```go
func f() (err error) {
	defer (func(){
		err = errors.WithStack(err)
	})()
	b := strings.Builder{}
	_, err := b.Write([]byte("hello"))
	if err != nil {
		return err
	}
	// ...
}
```

ある程度楽をできるし、この後の議論をした上でもバランスの良い選択肢だと思うが課題も感じている。その課題と解決案を以降で議論する。

# 課題

1. deferを書くのを忘れそう
    - こちらはリンターでなんとかなるだろう。ここでは深く議論しない
1. deferの中でerrors.WithStackを呼ぶと、エラーの発生源から離れるため、具体的にどのreturn errで落ちたかがスタックトレースから追えない
    - エラーメッセージから判断できる可能性は大きいけど

二つ目の課題の例を以下に挙げる。fではどの行で落ちたか分からないが、gではどちらのwithStackで生成したかが残る。

```go
func f() (err error) {
	defer (func() {
		err = errors.WithStack(err)
	})()
	if err := ok(); err != nil {
		return err
	}
	if err := ng(); err != nil {
		return err
	}
	return nil
}

func g() (err error) {
	if err := ok(); err != nil {
		return errors.WithStack(err)
	}
	if err := ng(); err != nil {
		return errors.WithStack(err)
	}
	return nil
}

func ok() error { return nil }
func ng() error { return errA }
var errA = errors.New("this is error")
```

<https://go.dev/play/p/SGr1B4sDF9I> で動かせる。

# 解決案: 型で頑張る

k1low/errorsでは、errors.WithStackは`func(error) error` 型を持つ。
それを `func(error) errors.T` とする。ここでTは以下のようなerrorをStackTraceメソッドで拡張したようなインターフェース。

```go
package errors

type T interface {
	error
	StackTraces() stackTraces // 戻り値型には議論の余地があるが、ここでは重要ではない。
}

// 唯一のT型のコンストラクタ
func WithStack(err error) T { ... }
```

スタックトレースを取りたいアプリケーションでは、すべての関数定義で返すエラー型を標準の errorではなく errors.Tとする。
そうすると、すべてのreturnされるエラーオブジェクトからスタックトレースを取得できることが保証される。

以下の二点が嬉しい。

1. errors.Tを返す関数しか呼ばない関数は繰り返しerrors.WithStackを呼ぶ必要がなくなる
1. errors.WithStackをエラーが発生するたびに (deferの中ではない！) 呼び出すように保証できるので、スタックトレースがちゃんと深くなる

この方法の問題は以下。人によっては許容できるだろう（ぼくはありだと思っている）。

1. すべての関数定義で返すエラー型をerrors.Tに統一する方法が定まっていないこと
1. errors.WithStackをたくさん呼ばないといけないこと
1. 独自のエラーインターフェースを定義していて気持ち悪いこと

一つ目はリンターを書けば良い。error型を返す関数を定義したら怒るだけなので簡単。deferでちゃんと書くことを保証するよりも難易度は低いはず。

二つ目は諦めるしかない。生成AIに頑張ってもらいたい。手書きするのは嫌だけど、補完があるならギリギリ許容できる気持ちがある。

三つは対処を思いつかない。これも諦めて受け入れるしかないだろう。
標準のエラーとは別物として扱おうとしているのだから型は真っ当に手法を表現している。解決手法がGoぽくないのだろう。

# 結論

- deferを使う手法ではスタックトレースがちょっと足りない
    - とはいえエラーメッセージが適切に設定されていれば問題ではない
    - 込み入ったこともしないでいいし簡単
- とはいえ設定もれが怖い気持ちや、スタックトレースをもう一段深く取りたい気持ちもある
    - そのときは今回提案した型で頑張る手法をとれば良いと思う
