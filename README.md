# 📝 Regera-Blog

## Overview

**Regera-Blog** is a fullstack **social blogging platform** that enables students to document their learning journey, share discoveries, and interact with peers.  
It’s built with **Spring Boot (Java)** for the backend, **Angular** for the frontend, and **PostgreSQL** for data persistence — all **dockerized** and orchestrated using **Docker Compose**, with a **Makefile** to simplify builds and runs.

Database schema evolution is handled automatically using **Flyway migrations**, and the Angular build is served efficiently via **Nginx**.

---

## 🚀 Features

### 👤 User Features

- Register, log in, and manage profiles securely (JWT-based authentication)
- View and edit personal **block pages** (profile + posts)
- Create, edit, delete, and view **posts** (with image/video support)
- Like and comment on posts
- Subscribe/unsubscribe to other users’ blocks
- Receive notifications for new posts from subscribed users
- Report inappropriate users with a reason and timestamp

### 🧑‍💻 Admin Features

- Access a protected **admin dashboard**
- Manage users (delete)
- Manage posts (delete inappropriate content)
- Review and handle user reports
- View platform statistics (optional analytics)

---

## 🧩 Technologies Used

| Layer | Technology | Description |
|-------|-------------|-------------|
| **Backend** | Spring Boot 3.x | REST API framework |
|  | Spring Security + JWT | Authentication & authorization |
|  | Spring Data JPA | ORM & database access |
|  | PostgreSQL | Relational database |
|  | Flyway | Database migrations & version control |
|  | Maven | Build and dependency management |
| **Frontend** | Angular 17+ | SPA framework |
|  | Angular Material / Bootstrap | UI components |
|  | Nginx | Serves production Angular build |
| **DevOps** | Docker | Containerization |
|  | Docker Compose | Multi-service orchestration |
|  | Makefile | Simplified build/run commands |

---

## 🚀 Starting the Application

You can easily build and run **01Blog** using the provided **Makefile**. The Makefile includes commands to build Docker images for the backend and frontend, run the PostgreSQL database, and start the application locally or in Docker containers.
!!! Make sure to get same as the `.env.example` in an `.env` file.

### Local Development

1. Start PostgreSQL:

```bash
make run-postgres
```

2. Build and run backend and frontend containers:

```bash
make run-backend && make run-frontend
```

This setup allows you to develop and test the backend and frontend on your machine while connecting to a local PostgreSQL instance.

### Dockerized Setup

To build and start all services in Docker containers:

```bash
make docker-up
```

To stop all containers:

```bash
make docker-down
```

#### Made with ❤️ by Regera
