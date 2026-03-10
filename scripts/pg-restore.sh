#!/bin/bash
#
# PostgreSQL 백업 복원 스크립트
#
# 사용법:
#   ./pg-restore.sh haengdong-20260310_030000.sql.gz

CONTAINER_NAME="haengdong-db"
DB_NAME="haengdong"
DB_USER="haengdong"
BACKUP_DIR="/backups"

if [ -z "$1" ]; then
  echo "사용법: $0 <backup-filename>"
  echo ""
  echo "사용 가능한 백업 목록:"
  sudo docker exec "$CONTAINER_NAME" ls -lh "$BACKUP_DIR"
  exit 1
fi

BACKUP_FILE="$1"
echo "WARNING: '$DB_NAME' 데이터베이스의 모든 데이터가 백업으로 교체됩니다."
read -p "계속하시겠습니까? (y/N): " CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "취소되었습니다."
  exit 0
fi

echo "$(date): Restoring from ${BACKUP_FILE}..."

sudo docker exec "$CONTAINER_NAME" bash -c \
  "dropdb -U $DB_USER $DB_NAME --if-exists && createdb -U $DB_USER $DB_NAME"

sudo docker exec "$CONTAINER_NAME" bash -c \
  "gunzip -c ${BACKUP_DIR}/${BACKUP_FILE} | psql -U $DB_USER $DB_NAME"

echo "$(date): Restore complete."
