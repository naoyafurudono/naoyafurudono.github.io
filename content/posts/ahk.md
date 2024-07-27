---
title: "AHK入門"
date: 2024-07-28T01:41:34+09:00
author: "Naoya Furudono"
draft: false
tags:
    - "daily"
    - "PL"
    - "tech"
    - "tool"
---

Windowsマシンでキーボード操作が不便なので導入する。
悪態をつきながらも使っている人を知っているので内容を理解していないが期待している。

# インストール

<https://www.autohotkey.com/> 公式ページからバイナリを落とせる。
インストールするとwelcome画面が開いたのだが、そこに「コンパイルする」ボタンがあって、ちょっと不安になる。
僕はプログラムをボタンを押してコンパイルしないといけない？

ついてきたマニュアルはいい感じのスタイリングでよみやすそう？

# マニュアルを読んでみる

頭から飽きるまで読んでいく。

- スクリプトの作成 (Create a Script)
  - > Be sure to save the file as UTF-8 with BOM if it will contain non-ASCII characters. For details, see the FAQ.
  - BOMがいるらしい。そういえばBOMってなんなのだろう。結局まだちゃんと理解してない。
- スクリプトの実行 (Run a Script)
  - なんかソースファイルをダブルクリックしたりして実行できて、実行してる間だけ効くらしい。
  - イベントハンドラみたいなやつの定義がそれぞれのスクリプトに対応するかと思っていたが、なんかメンタルモデルがあってなさそう
- それぞれのスクリプト実行がWindowsのトレイアイコンに反映されるらしい。なるほど

飽きたのでhello worldする。

# hello world

以下はCapsLockを押すとhello, worldと出力するよう設定するahkスクリプト。
ちなみにこれらのhello, worldはCapsLockを打って入力している。

```ahk
#Requires AutoHotkey >=v2.0.0

CapsLock::
  {
    SendInput "hello, world"
  }
  Return
```

CapsLockで英数変換するのは以下で実現できた。

```ahk
#Requires AutoHotkey >=v2.0.0

CapsLock::
  {
    SendInput "^{Space}"
  }
  Return
```

紆余曲折あって、以下のようになった。Windowsでもいい感じにvim使えるようになって幸せ。

<https://github.com/naoyafurudono/dotfiles/blob/main/autohotkey.ahk>

```ahk
#Requires AutoHotkey >=v2.0.0

IME_SET(SetSts, WinTitle:="A")    {
    hwnd := WinExist(WinTitle)
    if  (WinActive(WinTitle))   {
        ptrSize := !A_PtrSize ? 4 : A_PtrSize
        cbSize := 4+4+(PtrSize*6)+16
        stGTI := Buffer(cbSize,0)
        NumPut("Uint", cbSize, stGTI.Ptr,0)   ;   DWORD   cbSize;
        hwnd := DllCall("GetGUIThreadInfo", "Uint",0, "Uint",stGTI.Ptr)
                 ? NumGet(stGTI.Ptr,8+PtrSize,"Uint") : hwnd
    }
    return DllCall("SendMessage"
          , "UInt", DllCall("imm32\ImmGetDefaultIMEWnd", "Uint",hwnd)
          , "UInt", 0x0283  ;Message : WM_IME_CONTROL
          ,  "Int", 0x006   ;wParam  : IMC_SETOPENSTATUS
          ,  "Int", SetSts) ;lParam  : 0 or 1
}

IME_GET(WinTitle:="A")  {
    hwnd := WinExist(WinTitle)
    if  (WinActive(WinTitle))   {
        ptrSize := !A_PtrSize ? 4 : A_PtrSize
        cbSize := 4+4+(PtrSize*6)+16
        stGTI := Buffer(cbSize,0)
        NumPut("DWORD", cbSize, stGTI.Ptr,0)   ;   DWORD   cbSize;
        hwnd := DllCall("GetGUIThreadInfo", "Uint",0, "Uint", stGTI.Ptr)
                 ? NumGet(stGTI.Ptr,8+PtrSize,"Uint") : hwnd
    }
    return DllCall("SendMessage"
          , "UInt", DllCall("imm32\ImmGetDefaultIMEWnd", "Uint",hwnd)
          , "UInt", 0x0283  ;Message : WM_IME_CONTROL
          ,  "Int", 0x0005  ;wParam  : IMC_GETOPENSTATUS
          ,  "Int", 0)      ;lParam  : 0
}

IME_TOGGLE() {
  current := IME_GET()
  IME_SET(!current)
}

IME_OFF() {
  IME_SET(0)
}

CapsLock::
  {
    IME_TOGGLE()
  }

~Esc::
  {
    IME_OFF()
  }
```
