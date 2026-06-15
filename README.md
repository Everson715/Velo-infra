# Velo Microservices Architecture 🚗

Bem-vindo ao repositório backend do **Velo**, um clone de aplicativo de mobilidade urbana (ride-sharing). Este ecossistema é construído com base em uma arquitetura robusta de microsserviços.

## 🛠️ Stack Tecnológica

- **Framework:** Laravel 12
- **Linguagem:** PHP 8.4
- **ORM / Database Manager:** Prisma ORM
- **Banco de Dados:** PostgreSQL 16
- **Infraestrutura:** Docker & Docker Compose
- **WebSockets:** Laravel Reverb (Para telemetria e rastreamento em tempo real)
- **Autenticação:** JWT (JSON Web Tokens)

## 📦 Microsserviços

A plataforma é dividida em 5 microsserviços independentes:

1. **[Identity & Driver Service](./identity-driver-service/README.md)** (Porta `8001`): Autenticação, gestão de usuários (Passageiros/Motoristas) e aprovação de documentos.
2. **[Trip Matching Service](./trip-matching-service/README.md)** (Porta `8002`): Lógica principal de corridas, cálculo de tarifas e pareamento motorista-passageiro.
3. **[Review & Rating Service](./review-rating-service/README.md)** (Porta `8003`): Sistema de avaliações e reputação pós-corrida.
4. **[Payment & Finance Service](./payment-finance-service/README.md)** (Porta `8004`): Transações financeiras, cobrança de passageiros e repasse aos motoristas.
5. **[Tracking & Telemetry Service](./tracking-telemetry-service/README.md)** (Porta `8005`): Rastreamento em tempo real da localização via WebSockets.

## 🚀 Como Executar Localmente

### 1. Inicialização

O repositório contém um script Bash automatizado para provisionar as pastas, instalar as dependências e clonar os templates Docker.

```bash
./init_services.sh
```

### 2. Subindo a Infraestrutura Docker

O arquivo `docker-compose.yml` na raiz orquestra todos os serviços. O banco de dados central (`velo-postgres`) lida com as bases de dados isoladas para cada serviço.

```bash
docker compose up -d --build
```

### 3. Conexão com o Banco e Prisma

Cada serviço possui sua própria string de conexão e gerencia seu `schema.prisma`. Utilizamos containers efêmeros do Node para rodar migrations sem sujar a máquina hospedeira.

*(Para detalhes de como gerenciar o banco via Prisma, verifique o README individual de cada serviço).*
