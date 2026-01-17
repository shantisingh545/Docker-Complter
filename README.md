
---

## Features

- **Backend**: Spring Boot application with REST APIs
- **Frontend**: Angular application
- **Database**: PostgreSQL for persistent data
- **CI/CD**: Jenkins pipeline for automated build, Docker image creation, push, and deployment
- **Dockerized**: Backend, frontend, and PostgreSQL can run as Docker containers
- **Environment Variables**: Configurable through `.env` file
- Orchestration-Kubernetes
---

## Environment Setup

1. **Install prerequisites** on local machine or server:
   - Docker & Docker Compose
   - Node.js & npm
   - Java 17+ (for Spring Boot)
   - Jenkins (for CI/CD)
   - Kubernetes(Minikube)

2. **Environment Variables** (for Jenkins pipeline):

Create a file `/home/jenkins/env/docker.env` with:

```env
DOCKERHUB_USER=your-dockerhub-usernamecd dashboard
docker-compose build
docker-compose up -d

DOCKERHUB_PASS=your-dockerhub-password
BACKEND_IMAGE=your-dockerhub-username/backend-app
FRONTEND_IMAGE=your-dockerhub-username/frontend-app
