---
title: "Syscall"
date: 2022-07-08T18:15:10+09:00
author: "Naoya Furudono"
draft: false
---

systemcallを初めて書いた。
パーミッションの挙動を調べるのがモチベーション。
以下を実行できてほしかったのだが、sudoにそんなファイルは無いと怒られてしまう。

```sh
gcc hello.c
chmod 000 hello.c
sudo a.out
```

`a.out` をexecvで読んだところ、そこでもエラーが起きた。
`errno` をみるとパーミッションが無いと怒られたようだ（execvを呼ぶバイナリをsudoで実行した）。

rootとして実行できていないのか、execvが認識するプロセスのユーザidがeidではなく、uidなのか...。

次の実験をした。`sudo` は関係ないようだ。
sudo su でrootになった。

```
# ls -l
合計 44
---------- 1 root     root     16520  7月  8 18:22 callee
-rw-rw-r-- 1 furudono furudono   103  7月  7 15:43 callee.cpp
-rwxr-xr-x 1 root     root     16136  7月  8 18:25 caller
-rw-rw-r-- 1 furudono furudono   240  7月  8 18:25 caller.c
# cat caller.c 
#include<errno.h>
#include<stdio.h>
#include<string.h>
#include<unistd.h>

int main()
{
  char ** args = {NULL};
  char * cmd = "./callee";
  errno = 0;
  int c = execv(cmd, args);  // my first system call
  fprintf(stderr, "%s\n", strerror(errno));
  return c;
}

# ./caller 
Permission denied
# chmod 100 callee
# ./caller
hello world
# chmod 010 callee
# ./caller
hello world
# chmod 001 callee
# ./caller
hello world
```

カーネルかファイルシステムの都合だろうか。

