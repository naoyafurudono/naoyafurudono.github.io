---
title: "Goのanalysisとtypesに入門する"
date: 2024-08-31T15:02:41+09:00
author: "Naoya Furudono"
draft: false
tags:
    - "daily"
    - "PL"
    - "tech"
    - "tool"
---

# 概要

Goで静的解析してリンターを実装したい。
具体的には、あるT1インターフェース型の変数がスコープにあるときは、T1よりゆるい任意の型の使用を禁止する、みたいな制約を入れたい。
その辺に転がっている記事ではASTを覗いてみたり、SSAを覗いてみたりするようだけど、ASTとその型をまともに扱っていつつ、いい感じに静的解析ツールとして仕上げる記事を見つけられなかった。

この記事ではGoプログラムの静的解析ツールを実装するために存在する標準的なツールチェーンの思想を説明する。Go Analyzerは静的解析ツールフレームワークとして用いる。具体的な静的解析には標準ライブラリを用いる。

# 作りたいもの

> 具体的には、あるT1インターフェース型の変数がスコープにあるときは、T1よりゆるい任意の型の使用を禁止する、みたいな制約を入れたい。

これを検証するGoの静的解析ツール。例えば以下のようなrの使用を検知したい。

```go
func parse(r io.Reader) (string, error) { ... }

func (rw io.ReadWriter) {
	var r io.Reader = getReader()
	s, err := dump(r) // 「rじゃなくてrwを使ってくれ〜！」と指摘したい。
	...
}
```

# analysis

<https://pkg.go.dev/golang.org/x/tools/go/analysis> これ。準標準なパッケージ。ドキュメントの冒頭に思想がちゃんと書かれているのでそれを読むのが良さそう。

## Analyzer構造体

一個の解析ツールに対応する。Analyzer.Runに解析を実行する関数を定義する。この解析ツールを実行するとき（実行するのはフレームワークの仕事）に、Pass構造体が渡される。

## Pass構造体

Pass構造体は解析対象のパッケージごとに作成される。なので解析の単位はパッケージごとということになりそう。いいじゃん。

```go
type Pass struct {
	Fset         *token.FileSet
	Files        []*ast.File
	OtherFiles   []string
	IgnoredFiles []string
	Pkg          *types.Package
	TypesInfo    *types.Info
	ResultOf     map[*Analyzer]interface{}
	Report       func(Diagnostic)
	...
}
```

こいつを通じて解析をする関数は処理対象のデータにアクセスしたり、処理結果を報告したりするぽい。
モナドとか代数的エフェクトみたいで綺麗だ。そう思うとあれらは抽象化された一つの振る舞いの切り口を表現するための基本的な演算を定義していたのだから、まあそうだなと思える。Kokaで静的解析ツールを作るときにはpassエフェクトを定義するのだろう。

> The Fset, Files, Pkg, and TypesInfo fields provide the syntax trees, type information, and source positions for a single package of Go code.

これは本質情報の予感。このあたりにうまくアクセスすることで、ぼくたちの頭の中で想像する型付き抽象構文木へのアクセスを実現できるんだろう。
データ構造が思ったのと違いそうなことには気をつけよう。

これらに加えて、他のanalyzerが出力してくれる結果をこのanalyzerの入力として使える。それにアクセスするためには pass.ResultOf[a].(aResType)を参照すればよい。

診断(diagnostics)を出したければPass.Reportとか、パッケージで提供されているReportfとかを使うらしい。

# Goの型付き構文解析木

ここまでで、モジュラーに静的解析ツールを実装するフレームワークの構造がわかった。それに乗っかれば静的解析をいい感じに動かすことはできそうだ。
静的解析の処理を実装する方法もなんとなくわかった。Pass構造体の世界観に乗っかればokな感じがする。

次に自在にプログラムを解釈する方法を知りたい。プログラムはコンパイラに処理されていろんな形態に変換されるので、ユースケースに応じて適切な表現を選ぶ必要がある。今回は型付き抽象構文木を扱いたいので、Pass構造体のFset, Files, Pkg, TypesInfoあたりを上手に使えると良さそうだ。特にTypesInfoが気になる。これは types.Info型をとるみたいなので、typesパッケージを見に行く。

typesパッケージはこれ <https://pkg.go.dev/go/types>。冒頭の説明がスッキリしていてまだ何をやれば型付き抽象構文木に対してクエリっぽいことをできるか、どんなクエリっぽいことが許されるかを理解できない。なので貼ってあったチュートリアルのリンクを辿る。なお、スッキリしている説明自体は読んでよかった。このパッケージが扱うフェーズで何をやるか説明されていて、もっと詳しく読んで良さそうなことに自信を持てた。

なお、僕の目的のためには他の解析ツールの結果を使う方が良いかもしれないとも思う。暇だし気になるのでチュートリアルを読むのに時間をかけるけど。

## チュートリアル

脱線したがチュートリアルを読み進める。<https://go.dev/s/types-tutorial> これ。
これを読む目的は、何をやれば型付き抽象構文木に対してクエリっぽいことをできるか、どんなクエリっぽいことが許されるかを理解すること。

このチュートリアルはジェネリクスには対応してないらしい。ジェネリクスのためのドキュメントは別途あるとのことだけど、今回は基礎を知りたいので気にしない。

イントロと例くらいは読んでみて、あとは斜め読みでいいかな。まずはイントロ。

> Measured by lines of code and by API surface area, it is one of the most complex packages in Go's standard library, and using it requires a firm grasp of the structure of Go programs.

とのこと。大変だ。

> Starting at the bottom, the go/token package defines the lexical tokens of Go. The go/scanner package tokenizes an input stream and records file position information for use in diagnostics or for file surgery in a refactoring tool. The go/ast package defines the data types of the abstract syntax tree (AST). The go/parser package provides a robust recursive-descent parser that constructs the AST. And go/constant provides representations and arithmetic operations for the values of compile-time constant expressions, as we'll see in Constants.

データ構造とアルゴリズムを分けるの賢そう。parserにastを定義しないとか偉い感じがする。色々あるんだろうな。どう嬉しいのかはわからないけど。定数畳み込みをastに対して実装したいが、parserに依存するわけではないよね、みたいな話かな。

名前解決、型検査、定数式の計算は一緒にやらないといけないなるほど。ここでいう名前解決とは、名前の出現に対してその宣言を対応させること。

例まで読んだがパッケージレベルの話しかわからないな。ぼくは式とかのレベルでプログラムを処理したいんだ！ということで本命のInfo構造体への言及を探すことにすると、[TypeAndValue](https://github.com/golang/example/tree/master/gotypes#typeandvalue)でそれらしいことを述べている。

Info.Typesは `map[ast.Expr]TypeAndValue` らしい。そろそろ手を動かして、プログラムのこの要素は式として扱われるか？とかをみたい。と思ったらドキュメントが例を出してくれた。こういうときが一番楽しい。式があったら型は得られるようになってるのね。
ただまだよくわかってなくて、mapの定義域をast.Exprとしているが、そのExprとして本当に登録されるのはどの範囲のExprなのかがわからない。
当然 `ast.Expr{}` なんて渡しても、その型を計算しているわけがない。どういう操作で手に入れたast.Exprに対しては、Info.Typeがその型を教えてくれるんだろうか。Infoを生成するやつが知ってるのかな。analysisパッケージはよくわからんPassがInfoを持っていたので微妙だけど、パッケージの単位で処理をするのでパッケージに存在するすべての式の型を教えてくれると思って良さそう？

確かに[Config.Check](https://pkg.go.dev/go/types#Config.Check)はパッケージを型検査して、引数にInfoへのポインタをとって結果を書き込みそう。

次に、型同士の比較をしたい。具体的には、T1が必要な文脈でT2は使えるか (assignable) を判定する方法が欲しい。そのためにこれが使える<https://pkg.go.dev/go/types#AssignableTo>。引数に渡すTypeインターフェースの値はTypeAndValueで取れるので、ほとんど勝ったようなもの。
ちなみに僕は、最初[ConvertibleTo](https://pkg.go.dev/go/types#ConvertibleTo>)を使っていて全然ダメだった。ConvertibleToは数値が変換できるか判定するやつぽい。
