#!/bin/bash
set -e

# Diretorio Raiz onde os repositórios irmãos vão morar
PARENT_DIR="/home/joseph/Documentos/Github"
mkdir -p "$PARENT_DIR"

echo "🚀 Inicializando o ecossistema poliglota do Velo..."

# 1. Identity Driver Service (PHP + Laravel 11)
echo "📦 [1/5] Inicializando identity-driver-service (Laravel)..."
if [ ! -d "$PARENT_DIR/Velo-identity-driver-service" ]; then
    composer create-project laravel/laravel "$PARENT_DIR/Velo-identity-driver-service" --quiet
    cd "$PARENT_DIR/Velo-identity-driver-service"
    composer require tymon/jwt-auth:^2.1 --quiet
    php artisan jwt:secret --force
else
    echo "⚠️ Pasta Velo-identity-driver-service já existe. Pulando..."
fi

# 2. Trip Matching Service (NestJS + TypeScript)
echo "📦 [2/5] Inicializando trip-matching-service (NestJS)..."
if [ ! -d "$PARENT_DIR/Velo-trip-matching-service" ]; then
    # Instala o CLI do NestJS temporariamente se não tiver e cria o projeto
    npx @nestjs/cli new "$PARENT_DIR/Velo-trip-matching-service" --package-manager npm --skip-git
    cd "$PARENT_DIR/Velo-trip-matching-service"
    npm install prisma @prisma/client --save-dev --quiet
    npx prisma init
else
    echo "⚠️ Pasta Velo-trip-matching-service já existe. Pulando..."
fi

# 3. Tracking Telemetry Service (Fastify + TypeScript)
echo "📦 [3/5] Inicializando tracking-telemetry-service (Fastify)..."
if [ ! -d "$PARENT_DIR/Velo-tracking-telemetry-service" ]; then
    mkdir -p "$PARENT_DIR/Velo-tracking-telemetry-service"
    cd "$PARENT_DIR/Velo-tracking-telemetry-service"
    npm init -y > /dev/null
    npm install fastify typescript @types/node tsx fastify-websocket --quiet
    npx tsc --init
else
    echo "⚠️ Pasta Velo-tracking-telemetry-service já existe. Pulando..."
fi

# 4. Review Rating Service (NestJS + TypeScript)
echo "📦 [4/5] Inicializando review-rating-service (NestJS)..."
if [ ! -d "$PARENT_DIR/Velo-review-rating-service" ]; then
    npx @nestjs/cli new "$PARENT_DIR/Velo-review-rating-service" --package-manager npm --skip-git
    cd "$PARENT_DIR/Velo-review-rating-service"
    npm install prisma @prisma/client --save-dev --quiet
    npx prisma init
else
    echo "⚠️ Pasta Velo-review-rating-service já existe. Pulando..."
fi

# 5. Payment Finance Service (Java + Spring Boot)
echo "📦 [5/5] Inicializando payment-finance-service (Spring Boot)..."
if [ ! -d "$PARENT_DIR/Velo-payment-finance-service" ]; then
    mkdir -p "$PARENT_DIR/Velo-payment-finance-service"
    cd "$PARENT_DIR/Velo-payment-finance-service"
    echo "💡 Baixando estrutura inicial do Spring Boot via Spring Initializr..."
    curl -G https://start.spring.io/starter.tgz \
        -d dependencies=web,data-jpa,postgresql,lombok \
        -d javaVersion=17 \
        -d bootVersion=3.2.4 \
        -d type=maven-project \
        -d baseDir=Velo-payment-finance-service \
        | tar -xzvf - -C "$PARENT_DIR/" > /dev/null
else
    echo "⚠️ Pasta Velo-payment-finance-service já existe. Pulando..."
fi

echo "✅ Todos os 5 repositórios irmãos foram devidamente estruturados e preparados!"