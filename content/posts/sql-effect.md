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

追記: 簡単に行けそうとか書いたが、ちゃんと面倒だった

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
// effect: select<user, member, organization> insert<member>, delete<member>
package org_service

// OrgServiceは組織に関連するサービスを提供する。
// effect: select<user, member, organization> insert<member>, delete<member>
type OrgService struct {
  repository repository.Repository
}

// effect: select<user, member. organization>, insert<member>, delete<member>
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
SQLクエリを発行するルートのGo関数にエフェクトをつけることがネックで、なんとかしてsqlcが生成したコードに対してエフェクトをつける必要がある。プラグインでは素直にはできない。

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

// effect: select<user, member, organization>
func ListOrganizationMember(name string) ([]string, error)

// effect: insert<member>
func AddMember(string, string) error

// effect: delete<member>
func RemoveMember(string, string) error
```

ここではシグネチャしか記載していないが、実際には関数本体も生成される。
関数につける作用の表明はバニラなsqlcではつかないのでプラグインを実装して対応したい。[^sqlc-use]

あとは普通にエフェクトを再帰的に計算して推論とチェックをすればいい。[^dirty]

[^sqlc-use]: コメントとしてつけるのは綺麗に実現できなさそうだったので、別ファイルに書き出してエフェクトシステムがそれを読み込むことにした

[^dirty]: めんどい。ちゃんとやろうと思うと実装だけでなく設計も面倒。

# 内部実装

## エフェクトシステム

一応どんな感じにするとよさそうかをメモしておく。

### 概念の定義

テーブル名は型として表現する。対象のSQLに出てくる全てのテーブル名をごそっと型として定義すれば良いだろう。
`t` は型を表す。

```
t ::= user | member | organization | ...
```

select とか insert とかは型を一つとって **エフェクトラベル** を返す型オペレータだと思うことにする。
`l` はエフェクトラベルを表す。

```
select: t -> l
insert: t -> l
delete: t -> l
update: t -> l
```

**エフェクト**とは、エフェクトラベルの集合である。
`eff` はエフェクトを表す。

```
eff = setof l
```

### 推論

関数とかパッケージ、式や文には一つのエフェクトを割り当てる。この割り当てる処理がエフェクトの**推論**である。
プログラムの部分を実行したときに、そこで生じうる操作を表すのがエフェクトである。そういう気持ちで推論を定義する。

#### 文の逐次実行

文s1を実行して、文s2を実行するプログラムが `s1; s2` である。
このプログラムの型とエフェクトをどのように推論するかを、以下の`推論規則`で定義する。

```
s1: () | eff1  s2: () | eff2
-----------------------
s1; s2: () | eff1 + eff2
```

下側が結論であり、上の二つが仮定である。上が成り立つならば下が成り立つ、という図式。

下側の結論は 「`s1; s2` には型 `()` がつき、エフェクトは `eff1 + eff2` である」と解釈する。`+` は和集合をとる演算子とします。
上の二つも同様である。

したがって、通しで読むと
「`s1` に型 `()` がつき、エフェクトは `eff1` である。`s2` に型 `()` がつき、エフェクトは `eff2` であると仮定する。このとき `s1; s2` には型 `()` がつき、エフェクトは `eff1 + eff2` である。」となる。

#### 関数定義

```
body: res | eff
--------------------------------------------------
func f(args: t1) res { body }: t1 -> eff res | {}
```

関数の型は `<引数の型> -> <関数のエフェクト> 結果の型` という形をとる。
関数定義自体の計算では何も操作しないためエフェクトは空。

#### アノテーション

```
function: t1 -> eff1 res | {}     eff1 < eff
---------------------------------------------------
function // effect eff : () | eff
```

だんだん変数を考慮に入れてないことで無理が生じてきた。アノテーションをつけていたら、それが優先される。ただし、計算されたエフェクトがアノテーションの部分集合であることを要求する。

# 実装

二つのコンポーネントに分けて実装している。

- エフェクトシステム: https://github.com/naoyafurudono/dirty
- sqlcの解析: https://github.com/naoyafurudono/sqlc-use

エフェクトシステムはひとまず真面目に作らないで、ヒューリスティックに実装している。綺麗な方針じゃないのでdirtyと名付けた。
作用という汚さをトラックするという気持ちももる（だったらtaintとかが普通か）。
偽陽性・偽陰性がたくさん出そうだが、ある程度の範囲ならそれっぽく動くと目論んでいる。

sqlc-useはクエリがどんなテーブルに対してどんな操作をするかを分析してjsonに吐くやつ。
コメントをつけるのは綺麗にできなさそうだった（sqlc-gen-go というプラグインに手を入れる必要がある）ので、別のプラグインとしてjsonファイルを生成して、エフェクトシステムがそれを読み込む方針に変えた。
dirtyがスキーマを定義して、それに適合する形式をsqlc-useが吐くべきなのだろうけど歴史的経緯によって今の構成にしている。
一通り動くようになったらそうする。

# ユースケース

このセクションではエフェクトとかSQLを考えることでどんな嬉しさを享受できそうか考える。

## モジュラモノリスでのデータ所有の管理

モジュラモノリスでは単一のデータベースをサブシステム間で共有しつつ管理する責務を分ける。そのために頑張りが必要である[^modular-monolith]。
責務の分割をソースコードで表明して強制するためのツールとして今回の提案が有効だろう。もともとこの目的のために開発を始めた。

[^modular-monolith]: [その先に進むためのモジュラーモノリス再入門](https://zenn.dev/loglass/articles/d2ea268a7522be#%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%E5%88%86%E5%89%B2%E3%82%92%E3%81%A9%E3%81%86%E6%BA%96%E5%82%99%E3%81%97%E3%81%A6%E3%81%84%E3%81%8F%E3%81%8B)

## APIの認可

このロールを持ったユーザはホゲホゲリソースに書き込めるが、また別のロールを持ったユーザは読み込むことしかできない、みたいな認可ルールがある。
APIを実装するに当たって、それらはどのように管理されるだろうか。APIハンドラはいろんな処理をするから、それ自体を見ただけでAPIがリソースに対してどんな操作を行うかはパッとはわからない。
また、APIの実装を更新したり依存するSDKを更新したときに操作する対象のリソースが変わるかもしれない。したがって実装からAPIが行うリソースへのアクセスは開発プロセスにわたって管理し続ける必要がある。

その一つの自動化手法としてエフェクトシステムを使うと良い。リソースを直接操作する関数にエフェクトのアノテーションをつけておけば、あとはAPIがどのリソースをどのように操作するかを計算できる。

## 設定値の使用箇所の特定

環境変数とかを含む設定値を管理するパッケージは世の中で使われている。例えばviperとか。
では、そこで定義された設定値は実際にどこで使われているだろうか、どのモジュールが依存しているだろうか。
それに簡単に答えるのがエフェクトシステムである。なんとかしてviperの設定読み出し関数にエフェクトのアノテーションをつければ、あとはその関数を読み出す関数が全て取れるようになる。なのでどのモジュールがどの設定値に依存するかもすぐにわかる。

# 関連研究

今回はGo言語にエフェクトシステムを入れることが僕にとってチャレンジングなポイントになるだろう。
関数型言語に入れる話しか知らないので、構造的部分型と可変な変数が普通に使われるGoに対して使い勝手の良いエフェクトシステムを定義することは自明ではないだろうと感じた。

[An Object-Oriented Effects System](https://www.researchgate.net/publication/221496521_An_Object-Oriented_Effects_System) これが参考になりそう。Javaにregionをいい感じに入れよう、そのためにエフェクトシステムを導入しよう、という研究ぽい。まだちゃんと読んでいないが、生成AIに読ませて質問したところいい感じ。部分型付けの方針についてヒントを得られた。
