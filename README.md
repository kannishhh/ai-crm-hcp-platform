# 🧠 AI-Powered Pharma CRM Platform

An enterprise-grade AI-powered Pharma CRM platform designed to streamline Healthcare Professional (HCP) interaction management using intelligent AI workflows, LangGraph multi-agent orchestration, real-time analytics, compliance monitoring, and automated follow-up generation.

---

# 🚀 Project Overview

This platform enables pharmaceutical representatives and healthcare engagement teams to:

- Log and manage HCP interactions
- Analyze engagement using AI
- Generate automated follow-up recommendations
- Detect compliance risks
- Monitor HCP sentiment and buying intent
- View live analytics dashboards
- Receive real-time notifications
- Persist all interaction data in PostgreSQL

The system uses LangGraph multi-agent workflows and structured AI extraction pipelines to automate clinical CRM workflows in real time.

---

# 🏗️ Architecture

## Frontend

- React.js
- Vite
- Redux Toolkit
- TailwindCSS
- Framer Motion
- Socket.IO Client

## Backend

- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- LangGraph
- Groq LLM
- WebSockets / Socket.IO

---

# ✨ Core Features

## 🤖 AI Copilot Assistant

- AI-powered clinical assistant
- Real-time interaction analysis
- Context-aware recommendations
- Multi-agent LangGraph workflow orchestration
- Conversational interaction editing

---

## 📝 Interaction Management

- Log HCP interactions
- Edit existing interactions
- AI-driven form auto-fill
- Structured data extraction
- PostgreSQL persistence
- Live dashboard synchronization

---

## 🧠 LangGraph AI Tools

### 1. Log Interaction Tool

Extracts structured interaction data from conversational clinical notes.

### 2. Edit Interaction Tool

Allows conversational updates to existing CRM records.

### 3. Follow-up Recommendation Tool

Generates:

- follow-up tasks
- suggested due dates
- priority levels
- engagement strategies

### 4. Compliance Analysis Tool

Detects:

- risky claims
- compliance issues
- regulatory concerns
- flagged language

### 5. HCP Engagement Insight Tool

Analyzes:

- buying intent
- engagement score
- sentiment
- competitor influence
- adoption likelihood

---

# 📊 Analytics Dashboard

Live analytics powered directly from PostgreSQL:

- Total interactions
- Sentiment distribution
- Engagement trends
- Buying intent analytics
- Compliance risk metrics
- HCP activity tracking
- Follow-up monitoring

---

# ⚡ Real-Time Features

- WebSocket notifications
- Live dashboard updates
- Instant analytics refresh
- Real-time AI response streaming
- Dynamic CRM synchronization

---

# 🗄️ Database

## PostgreSQL

- Used as the primary production database.

## Alembic

- Used for:
  schema migrations
  version tracking
  database upgrades
  production-safe migrations

---

# 🧠 AI Workflow Architecture

The application uses LangGraph multi-agent orchestration:

```text
User Input
   ↓
Supervisor Agent
   ↓
Tool Selection
   ├── Log Interaction Tool
   ├── Edit Interaction Tool
   ├── Follow-up Tool
   ├── Compliance Tool
   └── HCP Insight Tool
   ↓
Structured Output Parsing
   ↓
Frontend State Updates
   ↓
Dashboard + WebSocket Updates
```

---

# 📂 Project Structure

```text
ai-crm-hcp-platform/
│
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── vite.config.js
│
├── backend/
│ ├── app/
│ │ ├── routes/
│ │ ├── services/
│ │ ├── tools/
│ │ ├── models/
│ │ ├── schemas/
│ │ ├── database/
│ │ └── workflows/
│ │
│ ├── alembic/
│ ├── alembic.ini
│ ├── requirements.txt
│ └── main.py
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
cd ai-crm-hcp-platform
```

## 2️⃣ Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

- Frontend runs on:

```bash
http://localhost:5173
```

## 3️⃣ Backend Setup

```bash
cd backend

python -m venv .venv
```

- Linux / macOS

```bash
source .venv/bin/activate
```

- Windows

```bash
.venv\Scripts\activate
```

- Install dependencies:

```bash
pip install -r requirements.txt
```

## 4️⃣ PostgreSQL Setup

```sql
CREATE DATABASE ai_crm_hcp;
```

- Create user:

```sql
CREATE USER crm_user WITH PASSWORD 'your_password';
```

- Grant privileges:

```sql
GRANT ALL PRIVILEGES ON DATABASE ai_crm_hcp TO crm_user;
```

## 5️⃣ Configure Environment Variables

- Create .env inside backend folder:

```env
DATABASE_URL=postgresql://crm_user:your_password@localhost:5432/ai_crm_hcp

GROQ_API_KEY=your_groq_api_key
```

## 6️⃣ Run Alembic Migration

```bash
alembic upgrade head
```

## 7️⃣ Start Backend Server

```bash
uvicorn app.main:app --reload
```

- Backend runs on:

```
http://localhost:8000
```

---

# 🔌 API Features

- Interaction APIs
  Create interaction
  Edit interaction
  Fetch interaction history
  Live analytics
- AI APIs
  AI interaction analysis
  Compliance checking
  Follow-up generation
  HCP insights
- WebSocket APIs
  Real-time notifications
  Live dashboard updates

---

# AI Analytics Generated

- The platform automatically generates:
  - Sentiment Analysis
  - Engagement Score
  - Buying Intent Score
  - Compliance Risk
  - Competitor Influence
  - HCP Interest Level
  - Adoption Probability
  - Follow-up Priorities

---

# Compliance Features

- Regulatory risk detection
- Flagged medical claim analysis
- Safety language monitoring
- Clinical compliance insights
- Adverse event indicators

---

# Real-Time Notification System

- Socket.IO powered notification system supports:
- Interaction saved alerts
- Follow-up reminders
- Dashboard refresh events
- AI workflow completion events
- Compliance alerts

---

# Testing

- Backend testing includes:
  - API testing
  - LangGraph workflow testing
  - Compliance validation
  - AI response validation
  - Database persistence testing
  - WebSocket event testing

---

# Production Highlights

- Enterprise-grade architecture
- Modular backend services
- Production PostgreSQL migration
- LangGraph orchestration
- Structured AI extraction
- Real-time analytics engine
- WebSocket infrastructure
- Scalable frontend architecture

---

# 👨‍💻 Author

### Kanish Kainth

- Full Stack Developer specializing in:
  React.js
  Flask
  FastAPI
  AI-integrated systems
  LangGraph workflows
  PostgreSQL architectures
