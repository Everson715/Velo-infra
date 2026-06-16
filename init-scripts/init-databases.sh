#!/bin/bash
set -e

# Cria as bases de dados isoladas para cada microsserviço
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE velo_identity;
    CREATE DATABASE velo_trips;
    CREATE DATABASE velo_tracking;
    CREATE DATABASE velo_reviews;
    CREATE DATABASE velo_payments;
EOSQL

echo "Bancos de dados inicializados com sucesso: velo_identity, velo_trips, velo_tracking, velo_reviews, velo_payments"
