# 🩺 RepoSurgeon

> **Autonomous AI Code Doctor that isolates, diagnoses, and heals broken repositories inside secure Vultr micro-sandboxes.**

[![Vultr Agent Rush](https://img.shields.io/badge/Vultr_Agent_Rush-Hackathon-007BFC?style=for-the-badge&logo=vultr&logoColor=white)](https://lablab.build/ai-hackathons/vultr-hackathon)
[![Blast Radius Zero](https://img.shields.io/badge/Security-Blast_Radius_Zero-10B981?style=for-the-badge&logo=shield)](https://lablab.build)
[![Powered by Vultr](https://img.shields.io/badge/Inference-Vultr_Serverless_Llama_3.3-blue?style=for-the-badge)](https://www.vultr.com)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_+_Tailwind-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)

![RepoSurgeon Cover Banner](reposurgeon_cover_banner.jpg)

---

## 📌 Overview

**RepoSurgeon** is an autonomous AI agent engineered to debug and heal software repositories with zero risk to host infrastructure. When given a repository or a failing test suite, RepoSurgeon:
1. Spins up an **ephemeral, isolated sandbox on Vultr**.
2. Executes the test suite inside the container to capture real stack traces and failures.
3. Consults **Vultr Serverless Inference (Llama 3.3 70B)** to diagnose root causes and generate surgical patches.
4. Applies fixes inside the quarantined sandbox and re-runs tests until they turn **100% green**.
5. Outputs clean, verified unified diffs ready for Pull Requests.

---

## 🛡️ "Blast Radius Zero" Security Architecture

Autonomous agents executing code can accidentally run destructive commands (`rm -rf`, fork bombs, resource starvation) or leak production environment secrets. RepoSurgeon enforces strict containment:

```
[ User Web Dashboard ]
         │ (WebSocket Stream)
         ▼
[ Vultr VM / FastAPI Orchestrator ]
         │
         ├──► [ Vultr Serverless Inference API ] (OpenAI SDK: Llama 3.3)
         │
         ▼
┌────────────────────────────────────────────────────────┐
│        VULTR EPHEMERAL MICRO-SANDBOX (CONTAINED)       │
│                                                        │
│  • Memory Limit: 512 MB                                │
│  • CPU Quota: 1.0 Core                                 │
│  • Network: Quarantined / Disabled                     │
│  • User: Non-root (sandboxuser:10001)                  │
│  • Auto-kill Timeout: 45s                              │
│  • Sanitized Environment (Zero Host Secrets)           │
│                                                        │
│  [ Copy of Repo ] ──► [ Pytest Suite ] ──► [ Output ]  │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart

### Prerequisites
* Python 3.10+
* Node.js 18+
* Docker (optional, but recommended for full container isolation)
* A Vultr API Key (for Vultr Serverless Inference)

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure your environment
cp .env.example .env
# Edit .env and paste your VULTR_API_KEY

# Start backend server
uvicorn app.main:app --reload --port 8001
```

### 2. Frontend Setup (In a separate terminal)
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🐳 Run with Docker Compose
To run the complete production stack (Backend + Frontend) in one command:
```bash
export VULTR_API_KEY="your_api_key_here"
docker compose up --build
```
Access the application at `http://localhost:3000`.

---

## 📁 Repository Structure
```
repo surgeon/
├── backend/                      # FastAPI Agent Server
│   ├── app/
│   │   ├── main.py               # REST API & WebSocket endpoints
│   │   ├── agent.py              # Autonomous diagnosis & repair loop
│   │   ├── vultr_client.py       # Vultr Serverless Inference client
│   │   ├── sandbox.py            # Container isolation runner ("Blast Radius Zero")
│   │   └── prompts.py            # Code repair prompts
│   ├── Dockerfile                # Backend container
│   ├── Dockerfile.sandbox        # Hardened ephemeral sandbox
│   └── requirements.txt
│
├── frontend/                     # React + Tailwind Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx        # Badges and live system status
│   │   │   ├── ContainmentCard.jsx # Real-time sandbox metrics
│   │   │   ├── TerminalLogs.jsx  # Live agent reasoning & pytest stream
│   │   │   └── DiffViewer.jsx    # Unified before/after code diff
│   │   └── App.jsx               # Main workbench
│   └── package.json
│
├── demo-repos/                   # Test suite with intentional bugs
│   └── broken-calculator/       # Python arithmetic bugs & failing pytest suite
│
├── docker-compose.yml            # Full-stack container deployment
└── README.md
```

---

## 🏆 Hackathon Details
* **Event:** [Vultr: Agent Rush Hackathon](https://lablab.build/ai-hackathons/vultr-hackathon) on Lablab.ai
* **Track:** Blast Radius Zero
* **Sponsor Technologies:** Vultr Serverless Inference (`https://api.vultrinference.com/v1`), Vultr Cloud Compute
