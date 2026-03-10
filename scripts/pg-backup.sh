#!/bin/bash
#
# PostgreSQL 자동 백업 스크립트
#
# 설치 방법 (self-hosted 서버에서):
#   1. 이 파일을 서버에 복사: scp scripts/pg-backup.sh user@server:/opt/haengdong/
#   2. 실행 권한 부여: chmod +x /opt/haengdong/pg-backup.sh
#   3. crontab에 등록: crontab -e
#      0 3 * * * /opt/haengdong/pg-backup.sh >> /var/log/pg-backup.log 2>&1
#
# 백업 위치: Docker named volume 'haengdong-backups' -> 컨테이너 내부 /backups
#   호스트에서 확인: docker volume inspect haengdong-backups

CONTAINER_NAME="haengdong-db"
DB_NAME="haengdong"
DB_USER="haengdong"
BACKUP_DIR="/backups"
RETENTION_DAYS=7
DATE=$(date +%Y%m%d_%H%M%S)

if ! sudo docker ps --format '{{.Names}}' | grep -w "$CONTAINER_NAME" > /dev/null 2>&1; then
  echo "$(date): ERROR - PostgreSQL container '$CONTAINER_NAME' is not running"
  exit 1
fi

echo "$(date): Starting backup..."
sudo docker exec "$CONTAINER_NAME" \
  pg_dump -U "$DB_USER" "$DB_NAME" | gzip > /tmp/haengdong-${DATE}.sql.gz

sudo docker cp /tmp/haengdong-${DATE}.sql.gz "$CONTAINER_NAME:${BACKUP_DIR}/haengdong-${DATE}.sql.gz"
rm -f /tmp/haengdong-${DATE}.sql.gz

echo "$(date): Backup complete -> ${BACKUP_DIR}/haengdong-${DATE}.sql.gz"

echo "$(date): Cleaning up backups older than ${RETENTION_DAYS} days..."
sudo docker exec "$CONTAINER_NAME" \
  find "$BACKUP_DIR" -name "haengdong-*.sql.gz" -mtime +${RETENTION_DAYS} -delete

echo "$(date): Done."
