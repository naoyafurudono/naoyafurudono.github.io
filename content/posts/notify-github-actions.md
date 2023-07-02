---
title: "GitHub Actionsの実行結果をDiscordに通知"
date: 2023-03-30T14:04:28+09:00
author: "Naoya Furudono"
draft: false
tags: [
    "daily"
    ,"tool"
]
---

このブログはGitHub Actionsでデプロイしているのだが、
ここしばらくデプロイに失敗したことに気が付かずに放置してしまっていた。

[Actions Status Discord](https://github.com/marketplace/actions/actions-status-discord)というアクションを[デプロイの最後に叩く](https://github.com/naoyafurudono/naoyafurudono.github.io/commit/1f7a900b4c8aa166dd735c61ee1667119b23e810)ことで、
いい感じの通知をDiscordにWebhook経由で送れる。

[こんな感じに](https://github.com/naoyafurudono/naoyafurudono.github.io/blob/3943f0fbf808d0ec880b3e7b9c901d0909eb35bd/.github/workflows/gh-pages.yml#L44)実行条件を指定しないと、
デプロイが失敗したときに通知が実行されないことに注意。
デフォルトでは `if ${{ success() }}` が指定されたものとみなされるとのこと。

