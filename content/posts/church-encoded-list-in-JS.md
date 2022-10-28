---
title: "Church Encoded List in JS"
date: 2022-10-28T18:21:12+09:00
author: "Naoya Furudono"
draft: false
---

Charch encodingで書いたリストの動くものがほしかったので書き下した。
`isnil`を実現するためにコンスを`isnil`、`car`、`cdr`からなるペアとして表現した。

```javascript
// cons list in Church encoding

const tr = t => f => t;
const fl = t => f => f;
const ite = c => t => f => c(t)(f);

const pair = f => s => pi => pi(f)(s);
const fst = p => p(f=>s=>f);
const snd = p => p(f=>s=>s);

const nil = pair(tr)(0);
const cons = x => xs => pair(fl)(pair(x)(xs));
const car = l => fst(snd(l));
const cdr = l => snd(snd(l));
const isnil = l => fst(l);

const foldr = f => b => l => (ite (isnil(l)) (() => b) (() => f(car(l))(foldr(f)(b)(cdr(l)))) ) ();

const len = l => foldr(elm => b => 1+b)(0)(l);

const lst = cons(1)(cons(2)(nil));
len(lst); // -> 2
```

