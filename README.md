# 🚀 Project Title

> **Update later**  
>
> For now, please check the [📄 document](./docs/README.md) for full document.

> After pulling the latest changes, run `npm install` and then `npm run prepare` to make sure Husky git hooks are active.

---

## 📌 Overview
A short description of your project will go here.
Explain what the project does and why it exists.

## ⚙️ Environment Setup

| Scenario | Command |
| --- | --- |
| Install dependencies after cloning | `npm install` |
| Install Husky hooks | `npm run prepare` |
| Copy `.env` template | `cp .env.example .env` |

## 🚀 Running the Application

There are three main approaches to run the application, each suited for different development scenarios:

### Option 1: Full Docker Setup
**Use case**: Quick setup, production-like environment, run migrations automatically. (and no seed data)
```bash
docker compose up --build
```
- Runs both the NestJS application and PostgreSQL database in Docker containers
- Everything is containerized and isolated
- Requires Docker and Docker Compose installed

### Option 2: Hybrid Setup (Recommended for Development)
**Use case**: Active development with faster iteration cycles while maintaining database consistency.
```bash
docker compose up -d db && npm run migration:run && npm run migration:seed && npm run start:dev
```

### Option 3: Full Local Setup
**Use case**: Complete control over all components, debugging database queries, or when Docker is not available.
```bash
npm run migration:run && npm run migration:seed && npm run start:dev
```
- **Assumes you have PostgreSQL running locally and configured**

### Access Points
| Resource | URL |
| --- | --- |
| Swagger UI | `http://localhost:3000/docs` |
| API base URL | `http://localhost:3000/api` |
