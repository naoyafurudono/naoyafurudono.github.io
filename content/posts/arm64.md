---
title: "arm64のメモ"
date: 2023-07-15T16:17:21+09:00
author: "Naoya Furudono"
draft: false
tags: [
    "daily"
    ,"PL"
    ,"tech"
]
---

[Cコンパイラを実装する](https://github.com/naoyafurudono/comp)ためにarm64のことを調べている。
この記事はそのメモ。

# 公式ドキュメント

よくあるソフトウェアのライブラリについているドキュメントとは毛色が違う。

- [Armv8-A Instruction Set Architecture](https://developer.arm.com/documentation/den0024/a/An-Introduction-to-the-ARMv8-Instruction-Sets)が優しい
  - [PDF版もある](https://developer.arm.com/-/media/Arm%20Developer%20Community/PDF/Learn%20the%20Architecture/Armv8-A%20Instruction%20Set%20Architecture.pdf?revision=ebf53406-04fd-4c67-a485-1b329febfb3e)。
    空白多めのシングルカラム39ページなのでサクッと読める。
    最初に読んでおくと幸せになれたかも。
- [Procedure Call Standard for the Arm® 64-bit Architecture (AArch64) (pdf)](https://github.com/ARM-software/abi-aa/releases/download/2023Q1/aapcs64.pdf)がCコンパイラを実装するときに気になる細かいことをコンパクトにまとめてそうな印象。
- 上のドキュメントを含む[公式のリンク集がある](https://github.com/ARM-software/abi-aa/releases)

# ツール

Arm macを使っている人の話です。

- 既存コンパイラがはくアセンブリを覗く方法
  - アセンブリをはく: `gcc -O0 -S`
  - ディスアセンブル: `otool -vVt`
- デバッガで調査する
  - lldbが使える
  - エラー箇所の特定に便利
  - ドキュメント
    - [入門記事（東大の講義ページ）](http://www.den.t.u-tokyo.ac.jp/ad_prog/debug/)
      何もわからんくなったら{ここに立ち返る|ここから始める}のが良さそう
    - [公式チュートリアル](https://lldb.llvm.org/use/tutorial.html): ちょっと読んだ。
      真面目に勉強するなら導入に良さそう

# 感想

アセンブリ命令って割と体系的になってなくてやばいイメージがあったけど、
arm64は秩序がある程度あるように感じている。まだ深淵を覗けていないだけかもしれないが。
汎用レジスタの名前が簡単なことが大きいかもしれない。

