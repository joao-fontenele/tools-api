.PHONY: build
build:
	docker-compose build
	docker-compose run --rm app npm i

.PHONY: start
start:
	docker-compose up -d

.PHONY: logs
logs:
	docker logs -f --since 2h --tail 200 tools-api | node_modules/.bin/pino-pretty

.PHONY: down
down:
	docker-compose down

.PHONY: test
test:
	docker-compose run --rm app npm run test

.PHONY: coverage
coverage:
	docker-compose run --rm app npm run coverage

.PHONY: lint
lint:
	docker-compose run --rm --no-deps app npm run lint

.PHONY: cli
cli: start
	docker exec -it tools-api sh

run-swagger-ui:
	@echo access http://localhost:8080
	docker run --rm -p 8080:8080 -v "${PWD}:/swagger" -e SWAGGER_JSON=/swagger/docs/openapi.yml swaggerapi/swagger-ui

run-swagger-editor:
	@echo access http://localhost:8080
	docker run --rm -p 8080:8080 -v "${PWD}:/swagger" swaggerapi/swagger-editor
