<!-- REVIEW: package.json name typo "medication-intercation-api"; README claims JWT API in progress but backend/app.js has no auth routes yet. -->

# Medax — Don't guess, check.

A full-stack medication interaction checker. Search any drug and instantly
check interactions with other medications, alcohol, food, and pregnancy risks.

## 🚧 Work in Progress

I'm currently working on polishing the frontend and building a user authentication system.
The next version will allow users to:

- 🔐 Create an account and securely save their medications (data stays private and is not shared)
- 📋 Keep track of medications in a personal dashboard
- ✏️ Edit and manage medication dosages with tailored information
- 🔔 Smart safety reminders, including missed-dose guidance and overdose prevention warnings

📝 **NOTE:** Currently, users can only **add or remove** medications. Direct editing of medication names is intentionally restricted for safety reasons - the app relies on **exact medication names** to fetch accurate information, and free-text edits could lead to incorrect results. Full edit functionality will be introduced once JWT-based authentication is implemented.

More features coming soon!

### UI polish (constructive notes)

The layout and visual hierarchy are already good, a few details will make the experience feel much more intentional:

- **In-page links and the header:** When you use “About” (or other nav links that scroll to a section), the **sticky navbar sits on top of the section title** (e.g. “About Medax”), so the heading looks cut off or hidden. Try adding **`scroll-margin-top`** on the target sections (or padding-top on the section) so scroll position lands _below_ the header, or use a small scroll offset in JS—either approach fixes “I clicked About but I can’t read the title.”

- **Labels vs buttons:** Several bits of UI **look like tappable buttons** (pills, badges, outlined chips) but **aren’t clickable**. Users will still try to click them. Either make them clearly **static** (e.g. softer fill, no shadow, smaller contrast with real buttons) or turn them into real controls if they should do something. Consistent “this is text / this is an action” styling.

- **Footer “Medax” treatment:** The large **Medax wordmark at the bottom** is **clipped by the bottom padding / overflow** so no letter reads cleanly. Worth checking **`overflow`**, **`padding-bottom`**, and **`line-height`** on that footer block so the decorative type has enough spacing.

## Live demo

https://medax-nu.vercel.app/

## What it does

- Search medications using the OpenFDA API
- Check drug interactions across 5 categories:
  - Drug-Drug
  - Drug-Alcohol
  - Drug-Food
  - Pregnancy & Breastfeeding
  - General Warnings
- JWT-protected REST API for managing medication data (In Progress...)
- React frontend with real-time search and interaction analysis

## Tech stack

**Frontend:** React, Vite, OpenFDA API

**Backend:** Node.js, Express, MongoDB, JWT

## Data source

Drug interaction data is sourced from the
[OpenFDA API](https://open.fda.gov/) — a free, public API
maintained by the U.S. Food & Drug Administration.

> **Note:** FASS (Swedish drug database) was the preferred data source
> but requires a paid agreement. OpenFDA was chosen
> as a free alternative with equivalent interaction data.

## Disclaimer

Drug interaction data is sourced from the U.S. Food & Drug Administration (OpenFDA). This is a study project — always consult your healthcare provider or pharmacist before making any changes to your medication regimen.
