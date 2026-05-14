# Application Testing Workflow: Microservices Transition

This document provides a step-by-step guide to testing the "Personal-Interviewer" application in its new microservices architecture.

---

## Workflow A: Local Integration (Fastest)
Use this for rapid development and to verify that the three services (Auth, Interview, Frontend) can communicate with each other and the MongoDB database.

1.  **Update Secrets**: Open `docker-compose.yml` and replace the following placeholders:
    *   `your_gemini_api_key_here`: Your actual Google Gemini API Key.
    *   `your_jwt_secret_here`: A secure string for JWT signing.
2.  **Launch the Stack**:
    ```bash
    docker-compose up --build
    ```
3.  **Verify Service Health**:
    *   **Frontend**: Open [http://localhost:80](http://localhost:80).
    *   **Auth Service**: Test endpoint at `http://localhost:5001/api/auth/login` (Expect 400/405, not 404).
    *   **Interview Service**: Test endpoint at `http://localhost:5002/api/interview/results` (Expect 401 Unauthorized).

---

## Workflow B: Full Orchestration (Minikube / Production-Like)
Use this to test the **Ingress Controller**, **Kubernetes Secrets**, and **DNS resolution**.

1.  **Set up DNS**:
    Update your `/etc/hosts` file to resolve the local domain to the Minikube IP:
    ```bash
    echo "192.168.49.2 interview.local" | sudo tee -a /etc/hosts
    ```
2.  **Update K8s Secrets**:
    Encode your actual keys to Base64 and update `k8s/base/secrets.yaml`:
    ```bash
    echo -n "YOUR_REAL_API_KEY" | base64
    ```
3.  **Deploy to Minikube**:
    *   **Option 1 (Automated):** Use the Ansible playbook:
        ```bash
        ansible-playbook ansible/playbooks/deploy.yml
        ```
    *   **Option 2 (Manual):** Use Kustomize to apply manifests:
        ```bash
        kubectl apply -k k8s/base/
        ```
4.  **Verify Ingress Routing**:
    *   **Frontend**: Access via [http://interview.local/](http://interview.local/).
    *   **API Routing**: Ensure `/api/auth/` and `/api/interview/` correctly route to their respective services.

---

## Workflow C: Functional Verification Steps
Perform these actions in the UI to confirm the microservices "mesh" is functional:

1.  **User Authentication**:
    *   Register a new user and log in.
    *   *Verification:* Ensure the **Auth Service** writes the user data to **MongoDB**.
2.  **Interview Generation**:
    *   Initiate a new interview session.
    *   *Verification:* Confirm the **Interview Service** validates the JWT, calls the **Gemini API**, and returns questions.
3.  **Data Persistence**:
    *   Save a chat session and navigate to the results page.
    *   *Verification:* Ensure the **Interview Service** successfully retrieves the saved history for the authenticated user.

---

## Troubleshooting & Debugging
*   **Logs**: Check specific service logs for errors:
    *   Docker Compose: `docker logs auth-service`
    *   Minikube: `kubectl logs -l app=interview-service`
*   **Networking**: If the Frontend cannot reach the backend, use the browser's Developer Tools (F12) to verify the request URLs (`interview.local` vs `localhost`).
