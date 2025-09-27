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
**Use case**: Quick setup, production-like environment, or when you don't want to manage local dependencies.
```bash
docker compose up --build
```
- Runs both the NestJS application and PostgreSQL database in Docker containers
- Everything is containerized and isolated
- Requires Docker and Docker Compose installed

### Option 2: Hybrid Setup (Recommended for Development)
**Use case**: Active development with faster iteration cycles while maintaining database consistency.
```bash
docker compose up postgres-db && npm run start:dev
```
- Database runs in Docker (consistent, isolated)
- NestJS app runs locally with hot-reload
- Best of both worlds: stable database + fast development cycles
- Requires Docker, Node.js, and npm installed locally

### Option 3: Full Local Setup
**Use case**: Complete control over all components, debugging database queries, or when Docker is not available.
```bash
npm run start:dev
```
- Both application and database run locally
- **Assumes you have PostgreSQL running locally and configured**
- Fastest startup time once environment is configured
- Requires Node.js, npm, and local PostgreSQL installation

### Access Points
| Resource | URL |
| --- | --- |
| Swagger UI | `http://localhost:3000/docs` |
| API base URL | `http://localhost:3000/api` |
