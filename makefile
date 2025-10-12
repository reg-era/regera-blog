include .env

APP_NAME=blog-backend
JAR_FILE=target/blog-0.0.1-SNAPSHOT.jar

run-postgres:
	docker run --name postgres-server \
	-e POSTGRES_USER=$(PSQ_USER) \
	-e POSTGRES_PASSWORD=$(PSQ_PASS) \
	-e POSTGRES_DB=$(PSQ_NAME) \
	-p $(PSQ_PORT):5432 \
	-d postgres:15

run-backend:
	cd backend/blog && \
	mvn clean compile && \
	ADMIN_NAME=$(ADMIN_NAME) ADMIN_EMAIL=$(ADMIN_EMAIL) ADMIN_PASSWORD=$(ADMIN_PASSWORD) \
	mvn spring-boot:run

run-frontend:
	cd frontend && npm start

docker-build:
	cd backend && docker build -t $(APP_NAME):latest .

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down
