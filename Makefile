# ===========================================================
# MenonTrucks – Docker Makefile
# ===========================================================

DOCKER_COMPOSE = docker compose
PHP_CONTAINER  = menontrucks-php
NODE_CONTAINER = menontrucks-node

.PHONY: up down restart fresh migrate seed shell logs test build \
        queue-restart cache-clear key-generate install

# -----------------------------------------------------------
# Core commands
# -----------------------------------------------------------

## Start all services in detached mode
up:
	$(DOCKER_COMPOSE) up -d

## Stop all services
down:
	$(DOCKER_COMPOSE) down

## Restart all services
restart:
	$(DOCKER_COMPOSE) down
	$(DOCKER_COMPOSE) up -d

## Build all Docker images
build:
	$(DOCKER_COMPOSE) build

# -----------------------------------------------------------
# Database & seeding
# -----------------------------------------------------------

## Run database migrations
migrate:
	$(DOCKER_COMPOSE) exec php php artisan migrate

## Run database seeders
seed:
	$(DOCKER_COMPOSE) exec php php artisan db:seed

## Fresh migration + seed + Elasticsearch reindex
fresh:
	$(DOCKER_COMPOSE) exec php php artisan migrate:fresh --seed
	$(DOCKER_COMPOSE) exec php php artisan scout:flush || true
	$(DOCKER_COMPOSE) exec php php artisan scout:import || true
	@echo "Fresh migration, seeding, and reindexing complete."

# -----------------------------------------------------------
# Utilities
# -----------------------------------------------------------

## Open a bash shell in the PHP container
shell:
	$(DOCKER_COMPOSE) exec php bash

## Tail logs for all services
logs:
	$(DOCKER_COMPOSE) logs -f

## Run the test suite
test:
	$(DOCKER_COMPOSE) exec php php artisan test

## Restart the queue worker
queue-restart:
	$(DOCKER_COMPOSE) restart queue-worker

## Clear all caches
cache-clear:
	$(DOCKER_COMPOSE) exec php php artisan optimize:clear

## Generate application key
key-generate:
	$(DOCKER_COMPOSE) exec php php artisan key:generate

## First-time install: build, start, migrate, seed
install: build up
	$(DOCKER_COMPOSE) exec php composer install
	$(DOCKER_COMPOSE) exec php php artisan key:generate
	$(DOCKER_COMPOSE) exec php php artisan migrate --seed
	$(DOCKER_COMPOSE) exec php php artisan storage:link
	@echo "MenonTrucks is ready! Visit http://localhost"
