# Personal Interviewer AI - Overhaul Roadmap

This document outlines the strategic transition of the Personal Interviewer AI from a monolithic architecture to a containerized, multi-model microservices ecosystem.

---

## Phase 1: Microservices Architecture & Containerization
**Goal:** Decouple the monolithic structure into independent, scalable services.

1.  **Service Decomposition:**
    *   **Frontend Service (React):** Handles UI/UX and audio streaming.
    *   **API Gateway (Nginx/Kong):** Routes requests to appropriate services.
    *   **Auth Service (Node.js/Go):** Manages user profiles, JWT, and session persistence.
    *   **Interview Orchestrator (FastAPI/Python):** The "Brain." Manages the interview state machine and business logic.
    *   **Inference Service (Python):** A unified wrapper for multi-model calls (Whisper, Hermes, DeepSeek).
2.  **Containerization:**
    *   Create `Dockerfiles` for each service.
    *   Use **Docker Compose** for local orchestration.
    *   Implement an asynchronous messaging queue (e.g., **Redis** or **RabbitMQ**) for handling heavy processing tasks like resume parsing or evaluation.

## Phase 2: Multi-Model AI Integration
**Goal:** Move away from a single model (Gemini) to specialized, high-performance models.

1.  **STT (Speech-to-Text):** Integrate **OpenAI Whisper** (via local `faster-whisper` or API) for high-accuracy transcription.
2.  **Orchestration (NLP):** Use **Nous Hermes 2 Pro** (via Ollama or Groq) for the general flow, project questioning, and personality.
3.  **DSA/Coding Logic:** Use **DeepSeek-Coder-V2** for generating and evaluating the technical/algorithmic section.
4.  **TTS (Text-to-Speech):** Integrate **ElevenLabs** or **Piper** (local) to give the AI a realistic voice.
5.  **Model Adapter Layer:** Build a service that abstracts the API calls so you can swap models without breaking the logic.

## Phase 3: Resume & JD Intelligence Engine
**Goal:** Transition from topic-based interviews to personalized, career-driven simulations.

1.  **Parsing Service:** Implement `PyMuPDF` or `LlamaIndex` to extract text from Resume (PDF/Docx) and JD.
2.  **Matching Engine:** Use the NLP model (Hermes) to generate a "Matching Map"—identifying where the user’s experience aligns with the JD and where the gaps are.
3.  **Prompt Engineering:** Create dynamic system prompts that inject the Resume/JD context into every stage of the interview.

## Phase 4: The Interview State Machine
**Goal:** Implement the structured sequence in real-time.

Implement a state-controlled logic in the **Orchestrator Service**:
*   **State 1: Introduction:** AI greets the user and asks for a brief intro based on the resume.
*   **State 2: Resume Deep-Dive:** Focus on the "Matching Areas" identified in Phase 3.
*   **State 3: Project Discussion:** Ask technical "why" and "how" questions about the projects listed.
*   **State 4: DSA Round:** AI triggers the **DeepSeek-Coder** module to provide 2-3 relevant algorithmic problems.
*   **State 5: The Puzzle:** AI switches back to **Hermes** for a logic-based brain teaser.
*   **State 6: Evaluation:** AI compares the transcript against the JD/Resume and generates a detailed JSON report.

## Phase 5: Real-Time Communication Layer
**Goal:** Low-latency interaction.

1.  **WebSockets (Socket.io):** Use WebSockets for the frontend to communicate with the Orchestrator. 
    *   Stream audio chunks to the STT service.
    *   Receive text/audio responses from the AI as they are generated (Streaming).
2.  **Concurrency:** Use Python's `asyncio` to handle multiple AI model calls simultaneously (e.g., evaluating a previous answer while the next question is being synthesized).

---

## Summary Roadmap & Timeline

| Phase | Focus | Key Tech |
| :--- | :--- | :--- |
| **Week 1-2** | **Infrastructure** | Docker, FastAPI, Redis, API Gateway |
| **Week 3-4** | **Model Integration** | Whisper, Hermes, DeepSeek-Coder API/Local |
| **Week 5** | **RAG & Parsing** | Resume/JD parsing, Context Injection |
| **Week 6** | **The State Machine** | Interview Flow Logic, Structured States |
| **Week 7** | **Streaming UI** | WebSockets, Audio Streaming, Real-time Dashboard |
| **Week 8** | **Review & Analytics** | Post-interview Feedback Engine, Scoring |
