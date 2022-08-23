---
title: "Python のfilter関数が良い"
date: 2022-08-19T17:32:37+09:00
author: "Naoya Furudono"
draft: false
---

[ドキュメント](https://docs.python.org/ja/3/library/functions.html#filter) を読むのが早い。

こういうことができる。

```sh
$ cat map-none.py                                                                                                                          17:34
def f(x):
    if x < 0:
        return x

for i in filter(f, map(lambda a: a-10, range(100) ) ):
    print(i)

$ python3 map-none.py                                                                                                                      17:34
-10
-9
-8
-7
-6
-5
-4
-3
-2
-1
```

静的型つき言語では `f` が `maybe` を返すようにして、
`filter` の代わりに [`mapMaybe`](https://hackage.haskell.org/package/base-4.17.0.0/docs/Data-Maybe.html#v:mapMaybe) のような関数を使うところだ。
Python のおしいところは、`filter` という名前でよぶところか。

```python
def map_maybe(fn, lst):
  filter(fn, lst)
```

とすれば良い話ではあるが。

こういう機能は Python に限らないような気はする。動的で関数型に関心のある言語ならこういう仕組みにするのが `None` のような値の扱いとして自然だろう

TODO: 他の動的言語での扱いを調べる。

- scheme
- CL
- JS
- ruby
- julia

