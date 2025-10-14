include .env

APP_NAME=blog

# Build
docker-build-backend:
	docker build -f backend/Dockerfile.backend -t $(APP_NAME)-backend:latest ./backend

docker-build-frontend:
	docker build -f frontend/Dockerfile.frontend -t $(APP_NAME)-frontend:latest ./frontend

# Run local dev
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
    SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/$(PSQ_NAME) \
    SPRING_DATASOURCE_USERNAME=$(PSQ_USER) \
    SPRING_DATASOURCE_PASSWORD=$(PSQ_PASS) \
    SERVER_PORT=$(BACKEND_PORT) \
	ADMIN_NAME=$(ADMIN_NAME) ADMIN_EMAIL=$(ADMIN_EMAIL) ADMIN_PASSWORD=$(ADMIN_PASSWORD) \
	mvn spring-boot:run

run-frontend:
	cd frontend && npm start

# Compose control
docker-up:
	docker compose up --build

docker-down:
	docker compose down

clean:
	cd backend && mvn clean

hard-clean: clean
	docker rmi $(APP_NAME)-backend:latest || true
	docker rmi $(APP_NAME)-frontend:latest || true
	docker volume prune -f

# Run both backend and frontend containers (for testing only)
docker-run-test:
	docker run -d --rm \
		--name blog-backend-test \
		-p 8080:8080 \
		$(APP_NAME)-backend:latest
	docker run -d --rm \
		--name blog-frontend-test \
		-p 4200:80 \
		$(APP_NAME)-frontend:latest

docker-stop-test:
	docker stop blog-backend-test || true
	docker stop blog-frontend-test || true
