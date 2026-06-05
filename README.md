# Medax — Don't guess, check.

A full-stack medication interaction checker. Search any drug and instantly get an **AI-powered, plain-English analysis** of interactions with other medications, alcohol, food, and pregnancy risks.

## 🚧 Work in Progress

The core interaction analysis is live and AI-powered. Upcoming features include:

- 🔐 User accounts — securely save medications (data stays private and is not shared)
- 📋 Personal medication dashboard
- ✏️ Manage and track medication dosages
- 🔔 Smart safety reminders, missed-dose guidance, and overdose prevention warnings
- 📱 Mobile app for iOS and Android

📝 **NOTE:** Currently, users can only **add or remove** medications. Direct editing of medication names is intentionally restricted for safety — the app relies on exact medication names to fetch accurate FDA data, and free-text edits could lead to incorrect results.

## Live demo

https://medax-nu.vercel.app/

## What it does

- Search medications using the OpenFDA API
- Select one or more interaction concerns:
  - Drug-Drug
  - Drug-Alcohol
  - Drug-Food
  - Pregnancy & Breastfeeding
  - General Warnings
- **AI-powered analysis** using GPT-4o — turns raw FDA label data into clear, plain-English summaries with severity ratings (mild / moderate / severe) and a clear recommendation on what to do next
- React frontend with real-time search and step-by-step interaction flow

## Tech stack

**Frontend:** React, Vite, OpenFDA API

**Backend:** Node.js, Express, OpenAI GPT-4o

**Planned:** MongoDB, JWT authentication

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
> but requires a paid agreement. OpenFDA was chosen
> as a free alternative with equivalent interaction data.

## Disclaimer

Drug interaction data is sourced from the U.S. Food & Drug Administration (OpenFDA) and interpreted by OpenAI GPT-4o. This is a study project — always consult your healthcare provider or pharmacist before making any changes to your medication regimen.
