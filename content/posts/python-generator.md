---
title: "Pythonのジェネレータをyieldで書く例"
date: 2023-01-06T17:47:42+09:00
author: "Naoya Furudono"
draft: false
tags: ["python"]
---

Pythonのジェネレータ（というより`yield`）の挙動を示す例を書いた。
二分木を作る`gen`と、ノードを探索してその内容を表す文字列を返すジェネレータを返す`conv`を定義した。
`conv`がこういう風に定義できることを例で確認したかった。

```python
from dataclasses import dataclass
import itertools
import random
from typing import Generator


@dataclass
class Tree:
    value: str


@dataclass
class Node(Tree):
    children: list[Tree]


@dataclass
class Leaf(Tree):
    pass


def gen(n):
    msg = f"{random.randbytes(1)}"
    if n <= 0:
        return Leaf(msg)
    else:
        return Node(msg, [gen(n - 1), gen(n - 2)])


def conv(t: Tree) -> Generator[str, None, None]:
    if isinstance(t, Leaf):
        yield f"Leaf: {t.value}"
    elif isinstance(t, Node):
        for i in itertools.chain(*map(conv, t.children)):
            yield i
        yield f"Node: {t.value}"


if __name__ == "__main__":
    import pprint as pp

    t = gen(3)
    pp.pprint(t)
    for i in conv(t):
        print(i)
```

