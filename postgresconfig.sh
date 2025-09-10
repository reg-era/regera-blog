#!/bin/bash
set -e

psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<-EOSQL
    CREATE TABLE IF NOT EXISTS example (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );
EOSQL
