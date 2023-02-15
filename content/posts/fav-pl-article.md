---
title: "好きなPL本"
date: 2023-02-16T02:08:43+09:00
author: "Naoya Furudono"
draft: false
---

プログラミング言語を勉強するとイディオムとかその言語界隈でのベストプラクティスが学べて良い、
みたいなことが巷でよく言われる。確かにそれはそのとおりだとぼくも感じるのだが、
雑にチュートリアルをこなしたりするだけでは言語をよく学べないだろうと思うし、良い情報源を見つけることはそんなに簡単ではないと感じている。

僕がこれまで呼んだPL系の本でこれはと思ったものがいくつかあるので紹介する。
(注意: 好奇心でアフィリエイトを試しています。アマゾンへのリンクはアフィリエイトを有効にしています。)

- C言語: [The C Programming Language](https://amzn.to/3E9NSqi)
- Go言語: [プログラミング言語Go](https://amzn.to/3lBC21x)
- OCaml: [Real World OCaml: Functional Programming for the Masses](https://amzn.to/3xIzdPf)
    - [ここで公式が無料でHTML版](https://dev.realworldocaml.org/toc.html)を公開している。
- Python: [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)
    - Python以外の言語についても[スタイルガイドがある](https://google.github.io/styleguide/)

どれも勉強になる。文化の共通部分と異なる部分があって楽しい。
共通部分はプログラミング全般で大切なのだろうと思うし、異なる部分は言語の活かし方なのだろうと思う。

そういえばこういう本を読んだときと、良いPLの論文を読んだときでは感想が異なる。
PLの論文はすごいアイデアを中心として、周辺の概念がうまく回っていく様を見せつけられると感動するのだが、
この手の本はもっといろんな機能や習慣がうまく組み合わさる様を見せつけてくれる。
甲乙つくものではないだろう。

ちなみに、いま述べた類の感動を与えてくれたのはこれら2つがぱっと思いついた:

- [Generalized Evidence Passing for Effect Handlers](https://www.microsoft.com/en-us/research/publication/generalized-evidence-passing-for-effect-handlers/)
- [Implementation Strategies for Mutable Value Semantics (pdf)](https://www.jot.fm/issues/issue_2022_02/article2.pdf)

1つ目は背景知識がたくさんいる気がするので人にはおすすめしない。
2つめは必要な背景知識が少なめなはず。

このように整理すると、local reasoningがPL意味論で大切にしたい中心的な概念に思える。本当だろうか。

