#!/bin/sh
set -e

DB_HOST="${DATABASE_HOST:-db}"
DB_PORT="${DATABASE_PORT:-5432}"
DB_WAIT_TIMEOUT="${DATABASE_WAIT_TIMEOUT:-60}"

echo "Waiting for database ${DB_HOST}:${DB_PORT}..."
./wait-for-it.sh "${DB_HOST}:${DB_PORT}" --timeout="${DB_WAIT_TIMEOUT}" --strict -- echo "Database is ready"

echo "Running database migrations..."
npm run migration:run

exec "$@"
