# ⟁ ContractScan — AI Legal Risk Analyzer

> Upload any PDF contract. AI scans every clause for hidden risks and explains them in plain English.

![ContractScan](https://img.shields.io/badge/stack-React%20%2B%20Node.js%20%2B%20Gemini-gold)
![License](https://img.shields.io/badge/license-MIT-green)

---

## What it does

- **Drag & drop** any PDF contract (NDA, employment, freelance, rental, SaaS)
- **AI reads every clause** and flags risks as High / Medium / Low
- **Plain English explanations** — no legal jargon
- **Actionable suggestions** for each risky clause
- **Overall verdict** — sign, negotiate, or avoid?

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, CSS (no UI library) |
| Backend | Node.js, Express.js |
| AI | Google Gemini 1.5 Flash |
| PDF | pdf-parse |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
contractscan/
├── backend/
│   ├── server.js          # Express API + Gemini integration
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx        # Full React app
    │   ├── App.css        # All styles
    │   └── main.jsx       # Entry point
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Setup & Run Locally

### 1. Get a Gemini API Key
- Go to https://aistudio.google.com/app/apikey
- Create a free API key (it's free!)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm run dev
# Backend runs on http://localhost:3001
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:3001 (already set)
npm run dev
# Frontend runs on http://localhost:5173
```

---

## Deploy to Production

### Frontend → Vercel
```bash
cd frontend
npm run build
# Push to GitHub, connect repo to Vercel
# Set env var: VITE_API_URL=https://your-backend.onrender.com
```

### Backend → Render
1. Push to GitHub
2. New Web Service on render.com → connect repo
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add env var: `GEMINI_API_KEY=your_key`

---

## Features

- Identifies: IP grabs, non-compete traps, one-sided termination, auto-renewal, liability caps, payment traps
- Color-coded severity: Red (High) / Yellow (Medium) / Green (Low)
- Expand/collapse each clause card
- Shows what's actually fine in the contract too
- Fully responsive mobile design

---

## Built by Vanisha Sharma
