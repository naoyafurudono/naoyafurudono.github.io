---
title: "git grep で検索して置換"
date: 2022-12-18T23:20:30+09:00
author: "Naoya Furudono"
draft: false
---

`git grep`は便利なのだが、置換の機能がない。
ぐぐると`sed`と組み合わせて置換する方法がたくさんでてくる。
スクリプトファイルに書き込んだのでメモしておく。

- POSIX準拠の正規表現を使える。
- 第２引数（置換後の文字列）ではマッチグループを参照できる。（`"\1にマッチした"`のように書く）

```rep.sh
#!/bin/bash

if [ $# -ne 2 ]; then
  echo "Arity mismatch. want: 2, actual: $#" 1>&2
  exit 1
fi

git grep -lE "$1" | xargs sed -i -E "s/$1/$2/g"
```

個人メモ：`~/.local/bin`に置いてある。

