#!/bin/sh
set -e

cd /app/apps/server

echo "Running Prisma migrations..."
prisma migrate deploy --schema ./prisma/schema.prisma

echo "Starting server..."
exec node dist/main.js
