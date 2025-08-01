---
title: "REPLの代わりとしてのテスト"
date: 2025-08-02T20:37:43+09:00
author: "Naoya Furudono"
draft: false
tags:
  - "PL"
  - "tech"
  - "idea"
  - "tool"
---

テストには色々な用途がある。ここではREPLの代わりとしてのテストについて語りたい。

本題に入る前にREPL代わり以外にどのような用途があるかを見ておく:

- 品質保証
- ドキュメント
- 試しに動かすためのエントリポイント（今回の本題）

テストと言ったら品質保証だろう。要求する品質を満たすことを検証するために元々テストをしていたはずだし、CIを回すのは品質保証のためだろう。

ドキュメントも大事なテストの役割だ。何かを説明するために具体例を提示するのは有効な手段で、コードの使い方を説明するためには実際にコードを動かす例を提示すればいい。
そのためにテストの形態をとることは有効だ。GoとかRustではテストを例として用いるための関数（Rustはマクロかも）が用意されているほどであり、広く認めらている捉え方だろう。

本題はここから。

試しに動かすためのエントリポイントしてのテストがある。これはREPLの代わりだと思える。
Ruby、Python、Haskellのような言語にはREPLが用意されていてインタラクティブに書いたコードを動かせる。
コードを編集してそれをREPLに送信することでそれを実行してREPLの状態を更新できる。REPLの魅力は実装の振る舞いの理解を簡単にすることと、探索的な実装を可能にすることだ。

REPLが常にあるわけではないし、REPLの状態はセッションを切ると揮発するものなので（永続化すればいいがそれは王道のユースケースではないだろう）インタラクティブには実行しないで、ファイルに処理を記録しそれを実行することができる。その実行をするためにテストのエントリポイントが有効だ。このような経緯でREPL代わりに試しの動作検証をテストとして表現する。

REPL代わりのテストはそれ単一で素早く書いて実行できるべきだ。書きやすい構文、粒度の細かい実行単位、わかりやすいフィードバック、小さなオーバーヘッドが求められる。
そして、よくをいうとその動作検証は開発するときに気になる部分なのだから、ちょっと整理して品質保証やドキュメントの用途に向くものに加工できて欲しい。

開発者のためのテストライブラリに求めらるのはこういう性質を満たすものだろう。コードを書くことを支援し、後の開発組織を助けるための実行環境としてのテストライブラリが良いテストライブラリだと思う。
