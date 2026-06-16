# Velo Infrastructure (Velo-infra)

Centralized infrastructure configuration for the "Velo" project, using a Multi-repo and Polyglot architecture.

## Overview

This repository provides the core DevOps infrastructure to run the entire Velo ecosystem locally using Docker Compose. It provisions a shared PostgreSQL instance, sets up databases for each microservice, and implements an Nginx API Gateway to route traffic to the appropriate service.

## Architecture & Microservices

The application comprises 5 independent microservices located in sibling repositories:

- **Identity & Driver Service** (`Velo-identity-driver-service`) - PHP/Laravel (Port 8000)
- **Trip Matching Service** (`Velo-trip-matching-service`) - Node.js/NestJS (Port 3000)
- **Tracking & Telemetry Service** (`Velo-tracking-telemetry-service`) - Node.js/Fastify (Port 3001)
- **Review & Rating Service** (`Velo-review-rating-service`) - Node.js/NestJS (Port 3002)
- **Payment & Finance Service** (`Velo-payment-finance-service`) - Java/Spring Boot (Port 8080)

## API Gateway Routing

All external traffic should go through the Nginx API Gateway (running on port `80`). It routes requests based on the following rules:

- `/api/v1/auth/*`, `/api/v1/users/*`, `/api/v1/me/*` → Identity Service
- `/api/v1/routes/*`, `/api/v1/estimates/*`, `/api/v1/pricing/*`, `/api/v1/match/*` → Trip Matching Service
- `/api/v1/tracking/*` → Tracking Telemetry Service *(Includes WebSocket Support)*
- `/api/v1/payments/*` → Payment Finance Service
- `/api/v1/reviews/*` → Review Rating Service

## Prerequisites

- Docker
- Docker Compose
- Ensure all 5 service repositories are cloned in the same parent directory alongside `Velo-infra`.

## Getting Started

1. **Clone all repositories**
   ```bash
   git clone <repo-url>/Velo-infra
   git clone <repo-url>/Velo-identity-driver-service
   git clone <repo-url>/Velo-trip-matching-service
   git clone <repo-url>/Velo-tracking-telemetry-service
   git clone <repo-url>/Velo-review-rating-service
   git clone <repo-url>/Velo-payment-finance-service
   ```

2. **Start the infrastructure**
   Navigate to the `Velo-infra` directory and start Docker Compose:
   ```bash
   cd Velo-infra
   docker compose up --build
   ```

3. **Verify**
   - The API Gateway will be available at `http://localhost/`
   - PostgreSQL will be running on `localhost:5432` with pre-created databases for each service (`velo_identity`, `velo_trips`, `velo_tracking`, `velo_reviews`, `velo_payments`).
