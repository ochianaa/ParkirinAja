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
	@docker-compose exec $(SERVICE) bun sequelize-cli db:migrate

# Usage: make migrate-undo SERVICE=auth-service
migrate-undo:
	@echo "⏪ Undoing last migration for $(SERVICE)..."
	@docker-compose exec $(SERVICE) bun sequelize-cli db:migrate:undo

# Usage: make new-migration SERVICE=auth-service NAME=create-users-table
new-migration:
	@echo "📝 Creating new migration $(NAME) for $(SERVICE)..."
	@docker-compose exec $(SERVICE) bun sequelize-cli migration:generate --name $(NAME)

# Usage: make seed SERVICE=auth-service
seed:
	@echo "🌱 Running seeders for $(SERVICE)..."
	@docker-compose exec $(SERVICE) bun sequelize-cli db:seed:all

# Usage: make admin-seed - Seeds admin user to auth-service database
admin-seed:
	@echo "👤 Creating admin user in auth-service..."
	@docker-compose exec auth-service bun sequelize-cli db:seed --seed 20251013205000-create-admin-user.js

## --------------------------------------
## Help Command
## --------------------------------------
help:
	@echo "Available commands:"
	@echo "  make migrate SERVICE=<name>         - Runs pending migrations for a service."
	@echo "  make migrate-undo SERVICE=<name>    - Undoes the last migration for a service."
	@echo "  make new-migration SERVICE=<name> NAME=<name> - Creates a new migration file."
	@echo "  make seed SERVICE=<name>            - Runs all seeders for a service."
	@echo "  make admin-seed                     - Seeds admin user to auth-service database."