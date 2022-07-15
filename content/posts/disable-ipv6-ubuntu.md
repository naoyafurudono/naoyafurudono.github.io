---
title: "UbuntuでIpv6を無効化する"
date: 2022-06-17T19:13:53+09:00
draft: false
tags: ["Ubuntu"]
---

学内ネットにVPN接続してIEEEの論文を取得しようとしたが、学内からのアクセスだと認識されなかった。
IPv6を無効化するとうまくいった。

MacではGUIでIPv6をon/offできたが、UbuntuではCUIから設定した（[参考ページ](https://www.server-memo.net/ubuntu/ubuntu_disable_ipv6.html)）。
以下を実行する。

```sh
sudo sysctl -w net.ipv6.conf.all.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.default.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.lo.disable_ipv6=1
```

設定は永続的ではない。
永続的でないことは `sysctl` の manページや [Red Hatのドキュメント](https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/8/html/managing_monitoring_and_updating_the_kernel/configuring-kernel-parameters-temporarily-with-sysctl_configuring-kernel-parameters-at-runtime) を参照すると分かる。

逆に有効化するためには、`...=1` を `...=0` にすればよいはずだ。こちらは動作確認をしていないことに注意。

僕へ: `~/.local/bin/disable-ipv6.sh` に上のスクリプトを書いた。パスが通っているので `sudo` をつけて実行せよ。

