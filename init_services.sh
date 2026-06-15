#!/bin/bash

# Diretorio Raiz
BASE_DIR="/home/joseph/Documentos/Github/Velo"
mkdir -p "$BASE_DIR"
cd "$BASE_DIR"

echo "🚀 Inicializando o ecossistema de microsserviços Velo..."

# Lista de servicos Laravel
SERVICES=("identity-driver-service" "trip-matching-service" "tracking-telemetry-service" "review-rating-service" "payment-finance-service")

for SERVICE in "${SERVICES[@]}"; do
    echo "------------------------------------------------------------"
    echo "📦 Criando e configurando: $SERVICE"
    echo "------------------------------------------------------------"
    
    # Cria o projeto Laravel 11 em modo API
    composer create-project laravel/laravel "$SERVICE" --quiet
    
    cd "$SERVICE"
    
    # Inicializa o gerenciamento do Node/Prisma local no microsserviço
    npm init -y > /dev/null
    npm install prisma --save-dev --quiet
    npx prisma init
    
    # Instala dependencias específicas
    if [ "$SERVICE" == "identity-driver-service" ] || [ "$SERVICE" == "trip-matching-service" ] || [ "$SERVICE" == "review-rating-service" ] || [ "$SERVICE" == "payment-finance-service" ]; then
        echo "🔒 Instalando JWT Auth no $SERVICE..."
        composer require tymon/jwt-auth:^2.1 --quiet
        php artisan jwt:secret --force
    fi
    
    if [ "$SERVICE" == "tracking-telemetry-service" ]; then
        echo "📡 Instalando Laravel Reverb para WebSockets..."
        # Executa em modo nao interativo para aceitar instalacoes padrao
        php artisan install:broadcasting --no-interaction
    fi
    
    # Cria a estrutura basica de pastas internas adicionais se nao existirem
    mkdir -p app/Services
    mkdir -p app/Http/Middleware
    
    # Copia o Dockerfile template
    cp "$BASE_DIR/Dockerfile.template" "Dockerfile"
    
    # Copia o script de check de conectividade
    cp "$BASE_DIR/check_connectivity.php" "check_connectivity.php"
    
    # Ajusta permissoes
    if [ -d "storage" ] && [ -d "bootstrap/cache" ]; then
        chmod -R 775 storage bootstrap/cache
    fi
    
    # Retorna para a raiz do Monorepo
    cd "$BASE_DIR"
done

echo "✅ Todos os microsserviços foram inicializados e estruturados com sucesso!"