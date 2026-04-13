# Microservices Transition Plan: Personal-Interviewer

This document outlines the strategy for decomposing the "Personal-Interviewer" monolith into a microservices architecture, leveraging Minikube for orchestration and incorporating DevSecOps and MLOps practices.

## 1. Finalized Architecture & Tech Stack

### Services
1.  **Auth Service (Node.js/Express)**: User registration, login, JWT issuance.
2.  **Interview Service (Node.js/Express)**: Session management, chat history, Gemini API integration.
3.  **Frontend Service (Vite/React)**: User interface.
4.  **API Gateway (Kubernetes Ingress)**: Routing traffic to services.

### DevSecOps Toolchain
- **CI/CD**: **Jenkins** (Automates testing, building, and pushing).
- **Containerization**: **Docker** (Images pushed to **Docker Hub**).
- **Orchestration**: **Minikube** (Pulls images from Docker Hub).
- **Configuration & Deployment**: **Ansible** (Manages environment setup and K8s manifest application).
- **Security**: **Snyk/Trivy** (Scanning in Jenkins pipeline), **K8s Secrets** (Secret management).

### MLOps Strategy
- **Prompt Versioning**: Prompts stored as versioned assets.
- **Monitoring**: Logging Gemini API latency and token usage.
- **Resiliency**: Circuit breakers for external AI API calls.

---

## 2. non-Interfering Integration Strategy

1.  **Environment Setup (Ansible)**: Ansible will be used to ensure Docker, Minikube, and Jenkins are installed and configured correctly on the host.
2.  **CI Pipeline (Jenkins)**: 
    - Jenkins triggers on Git commits.
    - Runs tests -> Builds Docker image.
    - Pushes image to **Docker Hub** with version tags.
3.  **Deployment (Ansible + K8s)**: 
    - Jenkins calls an Ansible playbook.
    - Ansible updates K8s manifests (Deployments/Services) to use the new Docker Hub image tag.
    - Ansible applies manifests via `kubectl` modules.
4.  **Orchestration (Minikube)**: Minikube pulls the updated images from Docker Hub and performs a rolling update.

---

## 3. Execution Roadmap

### Phase 1: Preparation (Current)
- [x] Create `feature/microservices-transition` branch.
- [x] Finalize Tech Stack & Plan.
- [ ] Initialize directory structure.

### Phase 2: Decomposition & Containerization
- [x] Extract **Auth Service** (Logic from `userController.js` and `User.js`).
- [x] Extract **Interview Service** (Logic from `userController.js`, `chat.js`, `questions.js`, `gemini.js`).
- [x] Create Dockerfiles for all services.
- [x] Configure `docker-compose` for local integration testing.
- [x] Refine `userApi.jsx` routes for microservice compatibility.

### Phase 3: CI/CD & Orchestration
- [x] Set up Jenkins Pipeline (`Jenkinsfile`).
- [x] Write Ansible playbooks for K8s deployment.
- [x] Create K8s manifests (Deployment, Service, Ingress, Secrets).
- [x] Add `kustomization.yaml` for resource management.
- [x] Create `setup-minikube.sh` script.
- [ ] Test pull from Docker Hub in Minikube.

### Phase 4: Validation
- [ ] Verify end-to-end flow: Frontend -> Ingress -> Auth/Interview -> MongoDB/Gemini.
- [ ] Perform security scans and load tests.
