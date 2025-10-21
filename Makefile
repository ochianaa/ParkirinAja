# Makefile for ParkirinAja Backend

MIGRATION_SERVICES := auth-service garage-service booking-service

# This command will be run if you just type `make`
.DEFAULT_GOAL := help

# pakai kalau tidak ada perubahan codingan di service
up:
	@docker-compose up

# pakai kalau ada perubahan codingan di service
up build:
	@docker-compose up --build

# pakai kalau ada perubahan dependency di package.json
rebuild:
	@docker-compose build --no-cache
	@docker-compose up

clean rebuild:
	@docker-compose down -v
	@docker volume prune -f
	@docker-compose build --no-cache
	@docker-compose up

# Usage: make migrate-all - pakai kalau ada perubahan pada migrasi database di semua service
migrate-all:
	@echo "🚀 Running migrations for ALL services..."
	@for service in $(MIGRATION_SERVICES); do \
		echo "--- Migrating $$service ---"; \
		$(MAKE) migrate SERVICE=$$service; \
	done
	@echo "✅ All migrations complete."

# Usage: make migrate SERVICE=auth-service
migrate:
	@echo "🚀 Running migrations for $(SERVICE)..."
	@docker-compose exec $(SERVICE) bun run db:migrate

# Usage: make generate-migration SERVICE=auth-service
generate-migration:
	@echo "📝 Generating migration for $(SERVICE)..."
	@docker-compose exec $(SERVICE) bun run db:generate

# Usage: make seed SERVICE=auth-service
seed:
	@echo "🌱 Running seeders for $(SERVICE)..."
	@docker-compose exec $(SERVICE) bun run db:seed

# Usage: make seed-all - Seeds all services
seed-all:
	@echo "🌱 Running seeders for ALL services..."
	@for service in $(MIGRATION_SERVICES); do \
		echo "--- Seeding $$service ---"; \
		$(MAKE) seed SERVICE=$$service; \
	done
	@echo "✅ All seeding complete."

# Usage: make studio SERVICE=auth-service - Opens Drizzle Studio for a service
studio:
	@echo "🎨 Opening Drizzle Studio for $(SERVICE)..."
	@docker-compose exec $(SERVICE) bun run db:studio

## --------------------------------------
## Help Command
## --------------------------------------
help:
	@echo "Available commands:"
	@echo "  make migrate SERVICE=<name>         - Runs pending migrations for a service."
	@echo "  make migrate-all                    - Runs migrations for all services."
	@echo "  make generate-migration SERVICE=<name> - Generates migration files for a service."
	@echo "  make seed SERVICE=<name>            - Runs seeders for a service."
	@echo "  make seed-all                       - Runs seeders for all services."
	@echo "  make studio SERVICE=<name>          - Opens Drizzle Studio for a service."