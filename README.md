# Medax — Don't guess, check.

A full-stack medication interaction checker. Search any drug and instantly
check interactions with other medications, alcohol, food, and pregnancy risks.

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
> but requires a paid agreement (15,000 SEK/year). OpenFDA was chosen
> as a free alternative with equivalent interaction data.

## Live demo

[medax.github.io](https://lauragitgit.github.io/Medication-Interaction-API/)

## Disclaimer

This is a study project. Always consult your healthcare provider
before making changes to your medication regimen.
