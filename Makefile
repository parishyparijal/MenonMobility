.PHONY: up down restart build fresh logs shell-api shell-web migrate seed studio es-reindex install

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

build:
	docker compose build

fresh: down
	docker compose up -d --build
	@echo "Waiting for services to be ready..."
	@sleep 10
	$(MAKE) migrate
	$(MAKE) seed

logs:
	docker compose logs -f

shell-api:
	docker compose exec api sh

shell-web:
	docker compose exec web sh

migrate:
	docker compose exec api npx prisma migrate dev

seed:
	docker compose exec api npx prisma db seed

studio:
	docker compose exec api npx prisma studio

es-reindex:
	docker compose exec api npm run reindex

install:
	docker compose exec api npm install
	docker compose exec web npm install
