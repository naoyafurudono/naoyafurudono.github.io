#!/usr/bin/bash

name="daily/$(date "+%Y-%m-%d")"

hugo new "${name}.md"
nvim "content/${name}.md"

