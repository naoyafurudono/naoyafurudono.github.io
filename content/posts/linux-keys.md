--- 
title: "Linux (gnome) でよくやる設定"
date: 2023-02-28T01:59:56+09:00
author: "Naoya Furudono"
draft: false
tags: [
    "tech"
    ,"tool"
    ,"linux"
    ,"gnome"
]
description: "Linux/gnomeでUSキーボードで日本語入力するときの設定方法をまとめる"
---

GNOMEというかLinuxというかでよくやる設定を列挙する。
キーボード系が多いと思う。

### gnome-terminal で`ctrl-(shift-)?tab`を有効にする

以下を実行

```sh
gsettings set org.gnome.Terminal.Legacy.Keybindings:/org/gnome/terminal/legacy/keybindings/ next-tab '<Primary>Tab'
gsettings set org.gnome.Terminal.Legacy.Keybindings:/org/gnome/terminal/legacy/keybindings/ prev-tab '<Primary><Shift>Tab'
```

参考: <https://askubuntu.com/questions/133384/keyboard-shortcut-gnome-terminal-ctrl-tab-and-ctrl-shift-tab-in-12-04>

### `capslock`で英数変換

[`xremap`](https://github.com/k0kubun/xremap)や[`xkeysnail`](https://github.com/mooz/xkeysnail)を使う
どちらもそんなに使い心地は変わらないと思う。
今は`xkeysnail`を使っている。

### `xkeysnail`をsystemdに起動してもらう

課題が2つある:

- `xkeysnail`が`uinput`を必要とすること
    - `sudo`が必要とreadmeに書かれているのはこれが理由
- `xkeysnail`をsystemdに登録すること
    - `sudo`つけられない/等価なことはできない？

以下のように解決する

1. 必要な権限を自分に与える
    1. sudoなしで`xkesynail`を実行できるようになる
1. systemdに登録して、ログインくらいのタイミングで有効にする

#### 権限を与える

これの通りにやればよい: <https://github.com/mooz/xkeysnail/issues/64#issuecomment-600380800>

#### systemdに登録する

1. 設定ファイルを書く <https://github.com/naoyafurudono/configs/blob/main/systemd/user/xkeysnail.service>
1. `~/.config/systemd/user/`におく
    1. バイナリをおく: 上の例では`~/.local/bin`においてあることを想定している
1. systemdに登録する: `systemctl --user enable --now xkeynail`
    1. `enable`で登録、`--now`で今実行

もしうごかなかったら`jounalctl -r`でsystemdのログをみる。

### 起動時に`mozc`の日本語入力を有効にする

<https://github.com/naoyafurudono/configs/blob/main/mozc/ibus_config.textproto>を`~/.config/mozc/`におく。

参考: <https://blog.nfurudono.com/posts/mozc-default-engine/>



