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
	cd backend && \
	mvn clean compile && \
	ADMIN_NAME=$(ADMIN_NAME) ADMIN_EMAIL=$(ADMIN_EMAIL) ADMIN_PASSWORD=$(ADMIN_PASSWORD) \
	mvn spring-boot:run

run-frontend:
	cd frontend && npm start

docker-build-backend:
	docker build -f Dockerfile.backend -t $(APP_NAME)-backend:latest .

docker-build-frontend:
	docker build -f Dockerfile.frontend -t $(APP_NAME)-frontend:latest .

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down

clean:
	cd backend && mvn clean compile

hard-clean: clean
	docker rmi $(APP_NAME)-backend || true
	docker rmi $(APP_NAME)-frontend || true