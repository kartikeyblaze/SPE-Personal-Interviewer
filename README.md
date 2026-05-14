# Scholar's Study | Personal Interviewer AI

A deployment-ready, microservices-based AI interview preparation platform. Designed with a premium "Classical Academic" aesthetic, it leverages Google Gemini AI to simulate rigorous, personalized interview scenarios.

## 🏛️ Project Vision
**"Scholar's Study"** moves away from generic tech aesthetics to provide a grounded, mentorship-focused environment. Interviews are treated as formal academic sessions, with results served as official transcripts.

## 🏗️ Architecture
The project is built on a robust microservices foundation:
- **API Gateway (Nginx)**: The single entry point, handling routing and serving the frontend.
- **Frontend Service (React + Tailwind + Framer Motion)**: A premium UI/UX experience with functional motion and organic earthy aesthetics.
- **Auth Service (Node.js/Express)**: Manages secure user enrollment and JWT-based session persistence.
- **Interview Service (Node.js/Express)**: Orchestrates the interview logic and integrates with the Google Gemini 1.5 Flash API.
- **Database (MongoDB)**: Isolated logical databases (`auth_db` and `interview_db`) within a shared instance.

## 🛡️ DevOps & Security
- **Containerization**: Fully Dockerized with optimized `Dockerfiles`.
- **Orchestration**: `docker-compose.yml` with native healthchecks and isolated networks (`frontend-nw`, `backend-nw`).
- **CI/CD**: Jenkins pipeline for building, scanning, and pushing images.
- **Automation**: Ansible playbooks for secret management and automated deployments.
- **Security**: Hardened with `helmet`, `cors` management, and isolated environment variables.

---

## 🚀 Getting Started

### Prerequisites
- **Docker & Docker Compose V2**
- **Google Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/))

### Quick Start (Local Deployment)

1.  **Clone & Prepare Secrets:**
    ```bash
    git clone <repository-url>
    cd major-project
    cp .env.example .env
    ```
    *Edit the `.env` file and provide your `JWT_SECRET` and `API_KEY_GEMINI`.*

2.  **Launch the Stack:**
    ```bash
    docker-compose up --build
    ```

3.  **Enter the Study:**
    Access the application at [http://localhost](http://localhost).

---

## 📖 Directory Structure

```text
major-project/
├── services/
│   ├── auth/           # Auth Microservice
│   ├── interview/      # Interview Microservice
│   └── frontend/       # React/Tailwind Frontend
├── nginx/              # API Gateway Configuration
├── ansible/            # Deployment & Secret Automation
├── jenkins/            # CI Pipeline Logic
├── k8s/                # Production Kubernetes Manifests
└── docker-compose.yml  # Local Orchestration
```

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Mongoose.
- **AI**: Google Generative AI (Gemini 1.5 Flash).
- **Infra**: Nginx, Docker, Ansible, Jenkins, MongoDB.

---

## 📜 License
This project is licensed under the ISC License.
