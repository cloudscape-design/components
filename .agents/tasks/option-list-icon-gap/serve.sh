#!/bin/zsh
# Dev server for the option-list-icon-gap worktree, bound to loopback only.
cd /Users/amanabiy/Documents/components/.worktrees/option-list-icon-gap || exit 1
export NODE_ENV=development
exec mise exec node@22.23.2 -- npx webpack serve --config pages/webpack.config.cjs --host 127.0.0.1 --port 8080
