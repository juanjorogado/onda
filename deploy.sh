#!/usr/bin/env bash
# Deploy ONDA Radio al servidor local (192.168.1.75) como systemd user service.
# Uso: ./deploy.sh
set -euo pipefail

REMOTE="192.168.1.75"
REMOTE_DIR="$HOME/public_html/onda"
SERVICE="onda-serve"

echo "==> 1/5 Build local"
npm run build

echo "==> 2/5 Sync dist -> $REMOTE:$REMOTE_DIR"
rsync -av --delete --exclude='.DS_Store' dist/ "$REMOTE:$REMOTE_DIR/"

echo "==> 3/5 Reiniciar servicio $SERVICE en $REMOTE"
ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$REMOTE" \
  "systemctl --user restart $SERVICE"

echo "==> 4/5 Esperar a que sirva"
for i in $(seq 1 15); do
  code=$(ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$REMOTE" \
    "curl -s -o /dev/null -w '%{http_code}' http://localhost:8090/" 2>/dev/null || true)
  if [ "$code" = "200" ]; then
    echo "OK HTTP 200"
    break
  fi
  sleep 1
done

echo "==> 5/5 Verificar CSS actualizado"
ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$REMOTE" \
  "curl -s http://localhost:8090/assets/css/index-*.css | grep -c 'margin-right:0' || true"

echo "Deploy completo."