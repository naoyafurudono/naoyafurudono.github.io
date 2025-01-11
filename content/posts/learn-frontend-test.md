---
title: "wip Next.jsでのテストを自由自在に書けるようになりたい"
date: 2025-01-11T19:03:01+09:00
author: "Naoya Furudono"
draft: false
tags:
    - "tech"
    - "tool"
---

Next.jsのアプリケーションでテストを自由自在に書けるようになることが目的。

vitestを用いる。アサーションには`expect`などを使ってマッチャを指定する。
expectや使えるマッチャは<https://vitest.dev/api/expect>が詳しい。

- テスト戦略の類型とトレードオフの把握
- ユーザインタラクションの再現
