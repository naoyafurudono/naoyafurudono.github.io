---
title: "Nextjsのプロジェクトにstorybookを導入してみた"
date: 2024-03-26T01:51:57+09:00
author: "Naoya Furudono"
draft: false
tags:
    - "daily"
    - "tech"
    - "tool"
---

# やったこと

<https://github.com/naoyafurudono/timer/pull/1>

このプルリクエストで頑張った。コミットメッセージにやったことは書いてある。

# 参考

公式ドキュメントがしっかりしてそう。storybookが内部で使っているwebpackが`@` インポートを読めないみたいで、プラグインを入れる必要があった。

- storyの書き方: <https://storybook.js.org/docs/writing-stories>
- Next.jsへのインストール: <https://storybook.js.org/docs/get-started/nextjs>
    - コマンド一発だった。便利。
- `@` インポートが効かない問題の対処: <https://qiita.com/sinnlosses/items/51e614570180c5f12e86>

