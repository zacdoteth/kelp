#!/bin/bash
# Kill old processes
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "cloudflared tunnel" 2>/dev/null
sleep 2

# Start Next.js dev server
cd /root/clawd/kelpfi/frontend
setsid npx next dev -p 3847 </dev/null > /tmp/next.log 2>&1 &
echo "Next PID: $!"

# Wait for server
for i in $(seq 1 20); do
  sleep 1
  CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3847 2>/dev/null)
  if [ "$CODE" = "200" ]; then
    echo "Server ready after ${i}s"
    break
  fi
done

# Start Cloudflare tunnel
setsid cloudflared tunnel --url http://localhost:3847 </dev/null > /tmp/tunnel.log 2>&1 &
echo "Tunnel PID: $!"

# Wait for tunnel URL
sleep 8
URL=$(grep -oP 'https://[a-z0-9-]+\.trycloudflare\.com' /tmp/tunnel.log | head -1)
echo "TUNNEL_URL: $URL"

# Verify
sleep 2
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL" 2>/dev/null)
echo "Tunnel status: $CODE"
