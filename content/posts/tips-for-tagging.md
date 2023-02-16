---
title: "HugoでタグをつけるためのTips"
date: 2023-02-16T16:34:49+09:00
author: "Naoya Furudono"
draft: false
tags: ["idea", "tool"]
---

車輪の再発明ではあるだろうけどメモしておく。
`archetypes/`に`hugo new`で生成する`.md`ファイルのテンプレを置くことができる。
そこにありうるすべてのタグを書いておけば、記事を書くときに関係ないタグを消すことで、関連するタグを忘れずにつけることができる。

僕は以下のようにフロントマターを設定している。

```
---
title: "TODO"
date: {{ .Date }}
author: "Naoya Furudono"
draft: true
tags: [
    "daily"
    ,"PL"
    ,"tech"
    ,"ubuntu"
    ,"alexa"
    ,"book"
    ,"idea"
    ,"python"
    ,"tool"
]
---
```
