---
title: "SQL エフェクト"
date: 2025-07-19T13:43:20+09:00
author: "Naoya Furudono"
draft: false
tags:
  - "daily"
  - "PL"
  - "tech"
  - "idea"
  - "tool"
---

GoとsqlcでAPIサーバを開発している。
責務がデカくなってくると、モジュラモノリスみたいに責務をパッケージに切りたくなる。
データベースのテーブルもへんなパッケージから参照されると困るので、パッケージの分割をテーブル集合の分割に対応させてメンテナンスしたい。

このコンポーネントはこれらのテーブルを所有していて、こっちのコンポーネントはこれらのコンポーネントを参照する、といったメンタルモデルを持っている。
それを明示的に表明したいし、間違ったときに指摘したいということ。

そこで考えているのがエフェクトシステムのアイデアを借用したあれこれ。

# エフェクトシステムぽい方式を用いるアイデア

関数、型、パッケージごとに、それらを使用した際にどんなテーブル操作が作用するかを計算する。
例えば、「関数ListOrganizationMemberはuser, member, organizationのテーブルをselectする」ことを計算する。

そのような作用が計算できれば「このパッケージでは、user, member, organizationのテーブルをselect, insert, deleteする」ことを別途表明しておくことで、
実際に計算されたパッケージが引き起こす作用がその表明を満たすことを検証できる。

以下はその例である。 `// effect: ...` の行で関数や型、パッケージについての表明を行う。
`repository` パッケージのメソッドを `SyncMembership` で呼び出している。
これらの関数にも別途表明が書かれており、それを元にツールは `SyncMembership` で引き起こされる作用を（保守的に）計算する。
その計算結果の作用が表明を満たすことを検証する。

反対に、もっともそれらしい表明を計算された作用から導出することもできる。

エイリアスとして `own = select, insert, delete` とか、`refer = select`、`mut = insert, update` とか（内容はてきとう）を定義してもいいだろう。

```go
//effect: select<user, member, organization> insert<member>, delete<member>
package org_service

// OrgServiceは組織に関連するサービスを提供する。
//effect: select<user, member, organization> insert<member>, delete<member>
type OrgService struct {
  repository repository.Repository
}

//effect: select<user, member. organization>, insert<member>, delete<member>
func (o *OrgService) SyncMembership(org organization, users []user) error {
  current, err := repository.ListOrganizationMember(org.name)
  if err != nil { return err }

  toBe := lo.map(users, getID)
  toAdd := set.Diff(toBe, current)
  toRemove := set.Diff(current, toBe)

  for _, uid := range toAdd {
    if err := repository.AddMember(org.name, uid); err != nil { return err }
  }
  for _, uid := range toRemove {
    if err := repository.RemoveMember(org.name, uid); err != nil { return err }
  }
  return nil
}
```

# 実現方針

エフェクトシステム自体は特に新しいアイデアではない。簡単なはずなのでここでは扱わない。
SQLクエリを発行するルートのGo関数にエフェクトをつけることがネックで、それをプラグインで実現することを提案する。

以下のようなSQLクエリを考える:

```sql
-- ListOrganizationMember :many
select user.* from user
inner join member on user.id = member.user_id
inner join organization on organization.id = member.organization_id
where organization.name = ?;

-- AddMember :exec
insert into member (user_id, organization_id) (?, ?);

-- RemoveMember :exec
delete from member where user_id = ? and organization_id = ?;
```

sqlcを用いると以下のようなGoの関数を生成できる:

```go
package repository

//effect: select<user, member, organization>
func ListOrganizationMember(name string) ([]string, error)

//effect: insert<member>
func AddMember(string, string) error

//effect: delete<member>
func RemoveMember(string, string) error
```

ここではシグネチャしか記載していないが、実際には関数本体も生成される。
関数につける作用の表明はバニラなsqlcではつかないのでプラグインを実装して対応したい。

あとは普通にエフェクトを再帰的に計算して推論とチェックをすればいい。
