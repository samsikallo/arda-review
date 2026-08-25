#!/bin/bash
# The Arda Archive — resilient serving. Restarts server+tunnel; writes the live URL to site/URL.txt and ~/arda_url.txt
cd "$(dirname "$0")"
CFD=$(command -v cloudflared || echo /tmp/cloudflared)
[ -x "$CFD" ] || { echo "cloudflared not found — download: curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o ~/cloudflared && chmod +x ~/cloudflared"; exit 1; }
pgrep -f "http.server 8737" >/dev/null || (python3 -m http.server 8737 --bind 127.0.0.1 --directory site >/dev/null 2>&1 &)
while true; do
  LOG=$(mktemp)
  "$CFD" tunnel --url http://127.0.0.1:8737 2>"$LOG" &
  CFPID=$!
  for i in $(seq 1 30); do
    URL=$(grep -oE "https://[a-z0-9-]+\.trycloudflare\.com" "$LOG" | head -1)
    [ -n "$URL" ] && break; sleep 1
  done
  if [ -n "$URL" ]; then
    echo "$URL" | tee site/URL.txt > ~/arda_url.txt
    echo "[serve_arda] live at $URL"
  fi
  wait $CFPID
  echo "[serve_arda] tunnel died — restarting in 5s"; sleep 5
done
