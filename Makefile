.DEFAULT_GOAL := help

.PHONY: help
help:  ## Список команд
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

COMPOSE_OVERRIDE=`test -f docker-compose.override.yml && \
                  echo '-f docker-compose.override.yml'`

COMPOSE_BASE=-f docker-compose.yml
COMPOSE_ALL=${COMPOSE_BASE} ${COMPOSE_OVERRIDE}

.PHONY: build
build:  ## Сборка проекта. Для конкретного сервиса укажите s="nginx".
	docker compose ${COMPOSE_BASE} build ${s}

.PHONY: up
up:  ## Запуск проекта. Для запуска с демонизацией укажите: OPTS="-d". Для конкретного сервиса укажите s="nginx".
	docker compose ${COMPOSE_ALL} up ${OPTS} ${s}

.PHONY: setup
setup: ## Базовая настройка проекта
	[ -f "docker-compose.override.yml" ] || cp docker-compose.override.example.yml docker-compose.override.yml
	[ -f ".env" ] || cp .env.example .env

.PHONY: shell
shell: ## запуск команды в работающем контейнере
	docker compose ${COMPOSE_ALL} exec frontend ${OPTS} bash
