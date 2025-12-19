# 🧠 Idea Planner — AI-Powered Idea Execution Assistant

Idea Planner is a full-stack application that helps users **store ideas**, **generate AI-powered execution plans**, and **stay consistent with reminders** via email.

The core philosophy is simple:

> Ideas shouldn’t die in notes apps.

---

## ✨ Features

- 🔐 JWT Authentication (Signup / Signin)
- 💡 Idea Management (Create, View, List)
- 🤖 AI Assistant to generate structured execution plans
- 🗂 Plan persistence (saved per idea)
- ⏰ Daily email reminders using Agenda (Mongo-backed scheduler)
- 📬 SMTP email notifications (non-blocking)
- 🔒 Protected routes with ownership checks

---

## 🛠 Tech Stack

### Backend

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Zod (request validation)

### AI

- LangChain
- OpenAI (GPT-4o-mini)
- Structured output using Zod schemas

### Background Jobs & Notifications

- Agenda (Mongo-backed job scheduler)
- Nodemailer (SMTP email sending)

---

## 📁 Project Structure

```
src/
├─ middleware/        # Auth middleware
├─ modules/           # Mongoose models (User, Idea, Plan)
├─ routes/            # Express routes
├─ services/          # AI logic, scheduler
├─ utils/             # Email utilities
├─ index.ts           # App entry point
```

---

## 🔐 Authentication Flow

- User signs up or signs in
- Server returns a **JWT token**
- The token must be sent in the `Authorization` header for protected routes

⚠️ **Important:**
The token is sent **directly**, without the `Bearer` prefix.

Example:

```
Authorization: <JWT_TOKEN>
```

---

## 📌 API Routes

### 1️⃣ Signup

**POST** `/auth/signup`

```json
{
  "username": "ashish",
  "email": "ashish@example.com",
  "password": "password123"
}
```

---

### 2️⃣ Signin

**POST** `/auth/signin`

```json
{
  "email": "ashish@example.com",
  "password": "password123"
}
```

---

### 3️⃣ Create Idea (Protected)

**POST** `/idea/create`

Headers:

```
Authorization: <JWT_TOKEN>
```

Body:

```json
{
  "title": "AI Planner",
  "mainIdea": "An app to help execute ideas using AI",
  "howToAchieve": "Using MERN stack and LangChain",
  "motivation": "Stay consistent and focused"
}
```

---

### 4️⃣ Get All Ideas (Protected)

**GET** `/idea/all`

Headers:

```
Authorization: <JWT_TOKEN>
```

---

### 5️⃣ Get Idea + Plan (Protected)

**GET** `/idea/:id`

Headers:

```
Authorization: <JWT_TOKEN>
```

Response:

```json
{
  "message": "get idea successful",
  "idea": { /* idea data */ },
  "plan": { /* plan data */ } | null
}
```

If no plan exists, `plan` will be `null`.

---

### 6️⃣ Generate AI Plan (Protected)

**POST** `/idea/assist/:id`

Headers:

```
Authorization: <JWT_TOKEN>
```

Response:

```json
{
  "message": "plan generated",
  "plan": {
    "summary": "...",
    "roadmap": [...],
    "challenges": [...],
    "improvements": [...],
    "nextSteps": [...]
  }
}
```

---

### 7️⃣ Update Notification Settings (Protected)

**POST** `/user/notification/update`

Headers:

```
Authorization: <JWT_TOKEN>
```

Body:

```json
{
  "emailEnabled": true,
  "smsEnabled": false,
  "phone": "",
  "reminderTime": "09:30"
}
```

This schedules a **daily email reminder** using Agenda.

---

## ⏰ Reminder System

- One Agenda job per user
- Runs exactly at `reminderTime`
- Mongo-backed (survives restarts)
- No cron hacks or polling

---

## 📬 Email Notifications

- SMTP-based using Nodemailer
- Fully async and non-blocking
- Reminder email contains:

  - Encouraging message
  - Next actionable steps from the AI plan

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## 🚀 Running the Project

```bash
pnpm install
pnpm dev
```

Server runs at:

```
http://localhost:5000
```

---

## 🧭 Future Enhancements

- 📊 Plan progress tracking
- 🔁 AI plan refinement based on user feedback
- 🌐 Browser notifications
- 📅 Weekly reflection emails
- 🧠 Agentic task breakdown into small tasks

---

## 🎯 Project Goal

This project demonstrates:

- Real-world backend architecture
- AI integration using LangChain
- Background job scheduling with Agenda
- Clean API design
- Production-ready async patterns
