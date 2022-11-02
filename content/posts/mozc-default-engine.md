---
title: "Mozc のデフォルトエンジンを設定する方法 2022 Oct"
date: 2022-10-28T17:24:06+09:00
author: "Naoya Furudono"
draft: false
---

設定ファイルを書き換えるとmozcのデフォルトを日本語入力にできる。
Ubuntu22.10でしか試していないことに注意。

```
$ cat ~/.config/mozc/ibus_config.textproto
engines {
  name : "mozc-jp"
  longname : "Mozc"
  layout : "default"
}
active_on_launch: True
```

## 環境

```
Distributor ID:	Ubuntu
Description:	Ubuntu 22.10
Release:	22.10
Codename:	kinetic
```

## 長い説明

Ubuntuで日本語をmozc、ローマ字を元から入っているUSのなにかで入力している。
このやり方のありがちな課題として、mozcのデフォルトが直接入力になっていることがある。安直に対処するなら、ubuntuにログインするたびGUIでmozcの切り替えを行えばよいが、毎回操作するのは面倒だ。デフォルトで日本語モードにすれば良くて、その実現方法を冒頭に載せた。

今年追加されたデフォルトエンジンを指定するオプションを用いて日本語入力をデフォルトにしている。
環境によっては設定ファイルを置くべきディレクトリが違うとか、既存の設定とマージする必要があるみたいなことはあるかもしれない。

### 参考

- [この件のIssue](https://github.com/google/mozc/issues/381)
    - 多くの人が困っていたみたいだ。
- [設定ファイルの説明](https://github.com/google/mozc/blob/master/docs/configurations.md#activate-mozc-on-launch)

