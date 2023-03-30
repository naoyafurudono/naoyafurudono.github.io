---
title: "Hugoのマークダウン処理をカスタム"
date: 2023-03-30T13:27:46+09:00
author: "Naoya Furudono"
draft: false
tags: [
    "daily"
    ,"tool"
]
---

# 背景

HTML文書のheading要素の周りには`id`がついていてほしいし、
それへのリンクは手軽にコピーできて欲しい。
その点Googleのドキュメントはとても好き。
人に文書コンテンツを渡すときにこちらの意図がURLで表現できるし、
そのリンクを踏んだ側も見るべき箇所にスムーズにたどり着ける。
このブログを書くのに使っているHugoでも同じことをした。

# やること

[このコミット](https://github.com/naoyafurudono/naoyafurudono.github.io/commit/3f28cbafd119216c194b82d1fded6b373e7a7332)のように、
[headingのHTMLへの変換を定義する](https://gohugo.io/templates/render-hooks/#heading-link-example)。

示したコミットでは`a`タグで囲むだけでなく、heading levelを増やしている。
Hugoではタイトルを`h1`にするにもかかわらず、マークダウンの`#`も`h1`にする。
そのせいで、本文を書くときは`##`から始める必要があって気持ち悪い。
この気持ち悪さを解消するために、マークダウンのheading level+1をhtmlのheading levelとしている。

