# <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Brain.png" alt="Brain" width="35" height="35" /> AI-Powered Pharma CRM Platform

An enterprise-grade AI-powered Pharma CRM platform designed to streamline Healthcare Professional (HCP) interaction management using intelligent AI workflows, LangGraph multi-agent orchestration, real-time analytics, compliance monitoring, and automated follow-up generation.

---

# <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" alt="Rocket" width="35" height="35" /> Project Overview

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

# <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Building%20Construction.png" alt="Building Construction" width="25" height="25" /> Architecture

## Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

## Backend

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-f3f3f3?style=for-the-badge&logo=groq&logoColor=black)

---

# <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Sparkles.png" alt="Sparkles" width="35" height="35" /> Core Features

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png" alt="Robot" width="35" height="35" /> AI Copilot Assistant

- AI-powered clinical assistant
- Real-time interaction analysis
- Context-aware recommendations
- Multi-agent LangGraph workflow orchestration
- Conversational interaction editing

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Memo.png" alt="Memo" width="35" /> Interaction Management

- Log HCP interactions
- Edit existing interactions
- AI-driven form auto-fill
- Structured data extraction
- PostgreSQL persistence
- Live dashboard synchronization

---

## <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Brain.png" alt="Brain" width="35" height="35" /> LangGraph AI Tools

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

# <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Bar%20Chart.png" alt="Chart" width="35" /> Analytics Dashboard

Live analytics powered directly from PostgreSQL:

- Total interactions
- Sentiment distribution
- Engagement trends
- Buying intent analytics
- Compliance risk metrics
- HCP activity tracking
- Follow-up monitoring

---

# <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Watch.png" alt="Watch" width="35" height="35" /> Real-Time Features

- WebSocket notifications
- Live dashboard updates
- Instant analytics refresh
- Real-time AI response streaming
- Dynamic CRM synchronization

---

# <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/File%20Folder.png" alt="Folder" width="35" /> Database

## PostgreSQL

- Used as the primary production database.

## Alembic

Used for:

- schema migrations
- version tracking
- database upgrades
- production-safe migrations

---

# <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Brain.png" alt="Brain" width="35" height="35" /> AI Workflow Architecture

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

# <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png" alt="Gear" width="35" /> Installation Guide

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

- Frontend runs on: `http://localhost:5173`

## 3️⃣ Backend Setup

```bash
cd backend
python -m venv .venv
```

- Linux / macOS: `source .venv/bin/activate`
- Windows: `.venv\Scripts\activate`
- Install dependencies: `pip install -r requirements.txt`

## 4️⃣ PostgreSQL Setup

```sql
CREATE DATABASE ai_crm_hcp;
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

- Backend runs on: `http://localhost:8000`

---

# <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shield.png" alt="Shield" width="35" /> Compliance Features

- Regulatory risk detection
- Flagged medical claim analysis
- Safety language monitoring
- Clinical compliance insights
- Adverse event indicators

---

# <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Bell.png" alt="Bell" width="35" /> Real-Time Notifications

- Socket.IO powered notification system supports:
- Interaction saved alerts
- Follow-up reminders
- Dashboard refresh events
- AI workflow completion events
- Compliance alerts

---

# <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People%20with%20professions/Man%20Technologist%20Light%20Skin%20Tone.png" alt="Man Technologist Light Skin Tone" width="35" height="35" /> Author

### Kanish Kainth

Full Stack Developer specializing in:

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
