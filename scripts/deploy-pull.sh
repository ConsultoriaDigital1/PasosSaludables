#!/usr/bin/env bash
# Deploy pull-based: corre por cron en el VPS cada minuto.
# Detecta commits nuevos en origin/main y reconstruye solo el contenedor app.
# Existe porque la red de Hostinger bloquea intermitentemente las IPs de
# GitHub Actions, asi que el deploy por push (SSH desde Actions) no es confiable.
# El .env del VPS se preserva (difiere del trackeado en el repo).
set -euo pipefail
exec 9>/var/lock/pasossaludables-deploy.lock
flock -n 9 || exit 0
cd /opt/pasossaludables
git fetch -q origin main
LOCAL=$(git rev-parse HEAD 2>/dev/null || echo none)
REMOTE=$(git rev-parse origin/main)
[ "$LOCAL" = "$REMOTE" ] && exit 0
echo "$(date -u +%FT%TZ) desplegando $REMOTE (antes: $LOCAL)"
cp .env /tmp/pasossaludables.env.bak
git reset --hard origin/main
cp /tmp/pasossaludables.env.bak .env
docker compose up -d --build app
docker image prune -f
date -u +%FT%TZ > .last_deploy
echo "$(date -u +%FT%TZ) deploy OK $REMOTE"
