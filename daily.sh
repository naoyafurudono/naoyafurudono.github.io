#!/usr/bin/bash

name="daily/$(date "+%Y-%m-%d")"

hugo new "posts/${name}.md"
nvim "content/posts/${name}.md"

