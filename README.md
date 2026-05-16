# ⟁ ContractScan — AI Legal Risk Analyzer

> Upload any PDF contract. AI scans every clause for hidden risks and explains them in plain English — instantly.

---

## Live App

> 📎 [contractscan.vercel.app]([https://contractscan.vercel.app](https://contract-scan-phi.vercel.app/))

---

## What is ContractScan?

Most people sign contracts without fully understanding what they're agreeing to. Legal language is dense, intentionally vague, and full of traps.

**ContractScan** solves this. Drop in any PDF contract — employment agreement, NDA, freelance contract, rental agreement, SaaS terms — and AI reads every clause, flags the risky ones by severity, and explains each risk in plain English with a suggestion on what to do.

---

## Features

- **Drag & drop PDF upload** — any contract up to 10MB
- **AI-powered clause detection** — identifies 4–8 risky clauses per contract
- **3-level severity system** — High / Medium / Low, color-coded
- **Plain English explanations** — no legal jargon
- **Actionable suggestions** — tells you exactly what to ask for or watch out for
- **What's fine too** — shows clauses that are actually reasonable
- **Overall verdict** — sign, negotiate, or avoid?
- **Fully responsive** — works on mobile and desktop

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite |
| Styling | Pure CSS (no UI library) — custom dark editorial theme |
| Backend | Node.js, Express.js |
| File Handling | Multer (in-memory), pdf-parse |
| AI | OpenRouter API → auto-selects best available free model |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
contractscan/
├── backend/
│   ├── server.js          # Express API — handles PDF upload + AI call
│   ├── package.json
│   └── .env      # Environment variable template
│
└── frontend/
    ├── index.html          # App entry + Google Fonts
    ├── vite.config.js
    ├── src/
    │   ├── App.jsx         # All React components
    │   ├── App.css         # Full dark theme styling
    │   └── main.jsx        # ReactDOM entry point
    └── .env
```

---

## How It Works

```
User uploads PDF
      ↓
React sends file via FormData to POST /analyze
      ↓
Express receives it → Multer stores in memory → pdf-parse extracts text
      ↓
Text + structured prompt sent to OpenRouter API (free AI model)
      ↓
AI returns JSON: { summary, overallRisk, clauses[], positives[], verdict }
      ↓
React renders expandable clause cards sorted by severity
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- A free [OpenRouter](https://openrouter.ai) account + API key

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/contractscan.git
cd contractscan
```

### 2. Set up the backend
```bash
cd backend
npm install
cp .env
```

Edit `.env`:
```
OPENROUTER_API_KEY=sk-or-v1-your_key_here
PORT=3001
```

```bash
npm run dev
# Backend running on http://localhost:3001
```

### 3. Set up the frontend
```bash
cd ../frontend
npm install
cp .env
# VITE_API_URL is already set to http://localhost:3001
npm run dev
# Frontend running on http://localhost:5173
```

---

## Deployment

### Frontend → Vercel
1. Push repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repo
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`
5. Deploy

### Backend → Render
1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variable: `OPENROUTER_API_KEY=your_key`
7. Deploy

---

## Key Engineering Decisions

**Why OpenRouter instead of direct Gemini/OpenAI?**
OpenRouter provides a unified API across 300+ models with a free tier that auto-routes to the best available model. This makes the app resilient — if one model goes down, it automatically switches.

**Why in-memory PDF storage?**
Using Multer's memory storage means PDFs are never written to disk — better for privacy, simpler for deployment (no file system management needed on serverless platforms).

**Why prompt engineering for structured output?**
Instead of post-processing raw AI text, the system prompt explicitly instructs the model to return valid JSON in a defined schema. This makes parsing reliable and the frontend predictable.

---

## What It Detects

- IP ownership grabs (company claiming rights to personal projects)
- Non-compete clauses (scope, duration, geography)
- One-sided termination rights
- Auto-renewal traps
- Liability caps unfavorable to the employee/user
- Penalty and clawback clauses
- Overly broad confidentiality terms
- Payment terms with hidden conditions

---

## Built By

**Vanisha Sharma**
3rd Year CSE Student · Global Institute of Technology, Jaipur
[LinkedIn](#) · [GitHub](#) · [Portfolio](#)

---

## License

MIT — free to use, modify, and distribute.
