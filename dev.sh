#!/usr/bin/env bash
set -euo pipefail

SESION="ministerio"

tmux new-session -d -s "$SESION" -n "nextjs" -c "$(pwd)"
tmux send-keys -t "$SESION:nextjs" "npm run dev" Enter

tmux new-window -t "$SESION" -n "ollama" -c "$(pwd)"
tmux send-keys -t "$SESION:ollama" "ollama serve" Enter

tmux new-window -t "$SESION" -n "tunel" -c "$(pwd)"
tmux send-keys -t "$SESION:tunel" "cloudflared tunnel run" Enter

tmux new-window -t "$SESION" -n "terminal" -c "$(pwd)"

tmux select-window -t "$SESION:nextjs"
tmux attach -t "$SESION"
