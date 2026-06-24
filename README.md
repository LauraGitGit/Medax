<p align="center">
  <img src="frontend/images/medax-logo.png" alt="MEDAX logo — Don't guess, check." width="280" />
</p>

# Medax — Don't guess, check.

AI-powered full-stack medication interaction checker. Search any drug and instantly get an **AI-powered, plain language analysis** of interactions with other medications, alcohol, food, and pregnancy risks.

## Live demo

https://medax-nu.vercel.app/

## What it does

- 🔍 Search medications from OpenFDA
- 💊 Check interactions with drugs, alcohol, food, and pregnancy, etc.
- **AI-powered analysis** summarizes medical information into plain language with a recommended guidance.
- **Swedish and English** — the site defaults to Swedish, with an **SV / EN** language switch in the top-right corner (next to the header)

## Tech stack

**Frontend:** React, Vite, OpenFDA API, deployed on Vercel

**Backend:** Node.js, Express, OpenAI GPT-4o mini, deployed on Render

**Planned:** MongoDB, JWT authentication, iOS & Android mobile app

## How it works

- The frontend pulls the relevant FDA label fields for each drug.
- It sends **medications + concern types + trimmed FDA text + locale (`sv` / `en`)** to the Express backend.
- The backend builds a prompt and calls **GPT-4o mini**; summaries and recommendations come back in the user's chosen language.
- Severity (`mild` / `moderate` / `severe`) is returned as structured JSON and rendered in the UI.

## 🚧 What's next?(WIP)

- ✏️ Possible FASS API interagation if agreement succeed for better user experiences.
- 🔐 User accounts(Optional) — securely save medications (data stays private and is not shared).
- 📋 Personal medication dashboard, manage and track medication dosages.
- 📱 Mobile app for iOS and Android

📝 **NOTE:** Currently, users can only **add or remove** medications. Direct editing of medication names is intentionally restricted for safety — the app relies on exact medication names to fetch accurate FDA data, and free-text edits could lead to incorrect results.

## How to run locally

One command starts both the frontend and backend together:

```bash
npm run dev
```

- Frontend runs on **http://localhost:5173**
- Backend runs on **http://localhost:3001**

Create a `.env` file in the project root with your OpenAI API key:

```
OPENAI_API_KEY=your-key-here
```

## Data source

Drug interaction data is sourced from the
[OpenFDA API](https://open.fda.gov/) — a free, public API
maintained by the U.S. Food & Drug Administration.

> **Note:** FASS (Swedish drug database) was the preferred data source
> but requires an agreement. OpenFDA was chosen
> as a free alternative with equivalent interaction data.

## Disclaimer

⚠ Drug interaction data is sourced from the U.S. Food & Drug Administration (OpenFDA) and interpreted by OpenAI GPT-4o mini. This is a study project — always consult your healthcare provider or pharmacist before making any changes to your medication regimen.
