---
title: "Golangでのlog"
date: 2022-06-19T18:30:06+09:00
draft: false
---

Golangの標準ライブラリに`log`がある。いろいろ関数が提供されているが、機能はざっくりいうと「引数で与えたメッセージにタイムスタンプをつけて標準エラー出力に流す」みたいな感じ。
ログにレベルをつけようと思うとこれでは足りない。レベルというのは、`DEBUG`とか`ERROR`みたいなやつ。
書くログ関数にレベルを設定した上で、グローバル変数とかで現在のレベルを設定する。プログラムを実行すると、現在のレベルで有効なログ関数だけが発火する。

Golangでこれをやろうと思うと、サードパーティを使うか自分で定義することになる。
自分で定義するのも意外と悪くない。
実装のほとんどは標準の`log`に委譲すれば済むし使い勝手は最高。設計に注意が必要なのと、面倒なのは間違い無いのでそれが難点か。
Golangのインターフェースのおかげで使い勝手を簡単によくできる。感謝。
