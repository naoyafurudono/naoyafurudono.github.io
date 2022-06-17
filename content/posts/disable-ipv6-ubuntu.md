---
title: "Disable Ipv6 Ubuntu"
date: 2022-06-17T19:13:53+09:00
draft: false
---

# Ubuntuでipv6を無効化する

学内ネットにVPN接続してIEEEの論文を取得しようとしたが、学内からのアクセスだと認識されなかった。
IPv6を無効化するとなんとかなった。

MacではGUIでIPv6をon/offできたが、UbuntuではCUIから設定した。[参考ページ](https://www.server-memo.net/ubuntu/ubuntu_disable_ipv6.html)
以下を実行する。

```sh
sudo sysctl -w net.ipv6.conf.all.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.default.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.lo.disable_ipv6=1
```

設定は永続的ではない。

僕へ: `~/.local/bin/disable-ipv6.sh` に上のスクリプトを書いた。パスが通っているので `sudo` をつけて実行せよ。

