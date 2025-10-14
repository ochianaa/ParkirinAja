# Makefile for ParkirinAja Backend

# This command will be run if you just type `make`
.DEFAULT_GOAL := help

## --------------------------------------
## Database Migration Commands
## --------------------------------------

# Usage: make migrate SERVICE=auth-service
migrate:
	@echo "🚀 Running database migrations for $(SERVICE)..."
	@docker-compose exec $(SERVICE) npx sequelize-cli db:migrate

# Usage: make migrate-undo SERVICE=auth-service
migrate-undo:
	@echo "⏪ Undoing last migration for $(SERVICE)..."
	@docker-compose exec $(SERVICE) npx sequelize-cli db:migrate:undo

# Usage: make new-migration SERVICE=auth-service NAME=create-users-table
new-migration:
	@echo "✍️  Creating new migration '$(NAME)' for $(SERVICE)..."
	@docker-compose exec $(SERVICE) npx sequelize-cli migration:generate --name $(NAME)

# Usage: make seed SERVICE=auth-service
seed:
	@echo "🌱 Seeding database for $(SERVICE)..."
	@docker-compose exec $(SERVICE) npx sequelize-cli db:seed:all

## --------------------------------------
## Help Command
## --------------------------------------
help:
	@echo "Available commands:"
	@echo "  make migrate SERVICE=<name>         - Runs pending migrations for a service."
	@echo "  make migrate-undo SERVICE=<name>    - Undoes the last migration for a service."
	@echo "  make new-migration SERVICE=<name> NAME=<name> - Creates a new migration file."
	@echo "  make seed SERVICE=<name>            - Runs all seeders for a service."