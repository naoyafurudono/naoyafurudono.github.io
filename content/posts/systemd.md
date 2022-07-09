---
title: "Systemd"
date: 2022-07-08T18:13:10+09:00
author: "Naoya Furudono"
draft: false
---

systemdでxremapを追加して、システム起動時に勝手にxremapが走るようにした。

僕の環境:

```
$ lsb_release -a
No LSB modules are available.
Distributor ID:	Ubuntu
Description:	Ubuntu 22.04 LTS
Release:	22.04
Codename:	jammy
```

xremapの作者の方が公開している設定を参考にした。

https://github.com/k0kubun/xremap/blob/6e8e1f21285ecedfa7ac88d703ad80d25a2699dd/examples/systemd/xremap.service

依存先が僕の環境では存在しないと怒られたので、`default.target` を指定した。
この設定ファイルを `~/.config/systemd/user` において、`systemctl --user enable xremap` を呼びだす。すると次回のsystemdが起動するときに、xremap を呼んでくれるようになる。

```
[Unit]
Description=xremap

[Service]
KillMode=process
ExecStart=/home/furudono/.local/bin/xremap /home/furudono/.config/xremap/xremap.conf
ExecStop=/usr/bin/killall xremap
Restart=always
Environment=DISPLAY=:0.0

[Install]
WantedBy=default.target
```

快適になった。
