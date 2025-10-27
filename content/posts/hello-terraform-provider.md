---
title: "Terraform Provider入門"
date: "2025-10-27"
created: "2025-10-27 21:54:38.921712 +0900 JST m=+0.002238167"
author: "Naoya Furudono"
draft: false
tags:
  - tech
  - tool
---

terraform プロバイダを完全に理解するためにこれを読む

https://developer.hashicorp.com/terraform/plugin

ふんわりわかった

https://github.com/keycloak/terraform-provider-keycloak/blob/be3b093587bb5dcae2e91afbcdf0b471ee4be090/provider/resource_keycloak_user.go
これ読んで完全に理解した

意外と愚直、フレームワークもっと頑張れるんじゃないだろうかと思ったら使っているフレームワーク最新じゃない見たい。

https://github.com/hashicorp/terraform-plugin-framework　これがnext generationで、
https://developer.hashicorp.com/terraform/plugin/framework-benefits　これが差分ぽい

差分の1/4くらいがパッと読んでいけてないと思ってたところだった
Goに慣れてきた感じがして嬉しい
元のsdkv2も、使いにくくはありそうだけど辛いというほどではなくて、それでもいいからまともに動く設計をできているのが偉いし、そういう微妙な設計でも一貫性を持ってやり通しているのがすごい
