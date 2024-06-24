---
title: "認可に入門 wip"
date: 2024-06-24T20:24:08+09:00
author: "Naoya Furudono"
draft: false
tags:
    - "daily"
    - "tech"
---

https://www.osohq.com/academy
これを読んで認可に入門します。頑張るぞ〜！

# イントロ

https://www.osohq.com/academy/authorization-academy

> Chapter II: What authorization is: how to organize your authorization code
> Chapter III: Role-based access control: grouping permissions in your app into roles like User and Admin
> Chapter IV: Relationship-based control: grouping permissions by relationship, like "the creator of a post may edit that post"
> Chapter V: Authorization enforcement: once your app has decided to allow or deny access, what do you do with that decision?

こんな感じとのこと。色々あるんだな。どれも気になるが、特にアプリケーションコードにどうやって統合していくかが気になるところかな。もれなく頑張らずに実現したい。

# What is Authorization?

https://www.osohq.com/academy/what-is-authorization

具体例を挙げてWebアプリケーションにはレイヤがあって、それぞれのレイヤではどんな情報を取れて、どんな認可ができるかを議論する。

また、["4. Adding Authorization to an Application>"](https://www.osohq.com/academy/what-is-authorization#authzlogic:~:text=4.%20Adding%20Authorization%20to%20an%20Application)ではコードでの認可処理の書き方を比較する。

Naiveなアプローチだと以下のつらみがあると言っている。それな〜。

> That quickly gets difficult. As the number of places where you need to apply authorization increases, you end up duplicating the same logic. Making any change then requires us to remember every place our logic is duplicated.

どうしたらいいんだ...

[Formalizing Our Authorization Model](https://www.osohq.com/academy/what-is-authorization#authzlogic:~:text=Formalizing%20Our%20Authorization%20Model) なるほどね（以下を認識する）。

- actor
- action
- resource

UNIXのファイルにつけるパーミッションもこの考えで整理されてそう。
どのユーザがどのファイルに対してどんな操作をするかを気にして権限の管理をしてるイメージ。

グループIDみたいなのはactorを発展させたものぽい。
sudoもその辺をいじるのかな。Capabilityはactionsの部分かな。それだけでもなさそうか。

上の三つ組を考えるメリットは二つあるとのこと。

- 言語を共有できる
- 設計としてシンプル

設計がシンプルと言ってるのは、以下のように認可のインターフェイスを持てそうということらしい。

```haskell
isAllowed:: (Actor, Action, Resource) -> Bool
```

こういうインターフェースを定めることで認可の周りで責務の境界を定められる。
呼び出し側の責務にenforcement, 呼ばれる側の責務にdicisionという名前をここではつけている。

## Enforcement

認可処理の結果をもとに何をするかを決めること。そもそも認可処理の呼び出しをするのもここの範囲だし、その結果アクセスがなければ403返すとかするのもここ。
良いかどうかを気にしつつ、その結果どうするかを決めるのがここ。

## Decision

基本はyes/noを返すやつ。さっきの関数の実装。
警告とかは出したきゃ出せばいい。
純粋である必要はなさそう。

## まとめ

[5. Putting Everything Together](https://www.osohq.com/academy/what-is-authorization#authzlogic:~:text=5.%20Putting%20Everything%20Together) がまとめだった。ここまでのメモが集約されてる感じ。

あとここには書かなかったけど、enforcementとかdicisionとかの話の後にenforcementをどこに実装する？みたいな話があるがマイクロサービスぽいアプリケーションを書いてないとそもそも問題にならなさそうで、一旦そこに僕は興味ないのでスルー。

## 課題

アーキテクチャの話はなるほどって感じだが、まだ考えられることはたくさんある。

- 権限が足りないときのエラーメッセージの返し方
    - 足りない場合は403だけじゃなくて何を足せば良いか知りたいとか
- 管理者にアプリユーザがどんな権限を持ってるかを表示するとか
- グループとか

# Role-Based Access Control (RBAC)

https://www.osohq.com/academy/role-based-access-control-rbac

