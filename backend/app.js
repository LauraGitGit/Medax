require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3001;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

// CORS for local frontend development (Vite: localhost:5173)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, message: "Backend is running" });
});

// Search medications by partial brand name.
app.get("/api/openfda/search", async (req, res) => {
  const { name } = req.query;
  if (!name || !String(name).trim()) {
    return res
      .status(400)
      .json({ message: "Query parameter 'name' is required" });
  }

  try {
    const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(String(name).trim())}*&limit=8`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: data?.error?.message || "OpenFDA request failed",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data from OpenFDA" });
  }
});

// Fetch label details for a single medication by exact brand name.
app.get("/api/openfda/label", async (req, res) => {
  const { name } = req.query;
  if (!name || !String(name).trim()) {
    return res
      .status(400)
      .json({ message: "Query parameter 'name' is required" });
  }

  try {
    const medicationName = encodeURIComponent(String(name).trim());
    const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${medicationName}"&limit=1`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: data?.error?.message || "OpenFDA request failed",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data from OpenFDA" });
  }
});

// AI-powered medication interaction analysis using OpenAI.
app.post("/api/analyze", async (req, res) => {
  const { medications, interactionTypes, fdaData } = req.body;

  if (!medications?.length || !interactionTypes?.length) {
    return res
      .status(400)
      .json({ message: "'medications' and 'interactionTypes' are required" });
  }

  const typeDescriptions = {
    "drug-drug": "interactions with other drugs taken at the same time",
    "drug-alcohol": "risks when this drug is combined with alcohol",
    "drug-food": "food or drink restrictions while taking this drug",
    "pregnancy-breastfeeding": "safety during pregnancy and breastfeeding",
    warnings: "important safety warnings and risks",
  };

  let fdaContext = "";
  for (const med of medications) {
    fdaContext += `\nMedication: ${med}\n`;
    for (const type of interactionTypes) {
      const text = fdaData?.[med]?.[type];
      const description = typeDescriptions[type] || type;
      if (text) {
        fdaContext += `  [${type}] ${description}: ${text.slice(0, 700)}\n`;
      } else {
        fdaContext += `  [${type}] ${description}: (no FDA data available — use general knowledge)\n`;
      }
    }
  }

  const totalEntries = medications.length * interactionTypes.length;

  const typeKeyList = interactionTypes
    .map((t) => `"${t}" → ${typeDescriptions[t]}`)
    .join("\n- ");

  const prompt = `You are a friendly, knowledgeable clinical pharmacist helping patients understand their medications in plain language.

Here is the FDA label data for the patient's medication(s):
${fdaContext}

Task: Return a JSON analysis for EVERY combination of medication × concern type below.

Concern type keys you MUST use exactly as written:
- ${typeKeyList}

Return a JSON object with this exact structure:
{
  "analyses": [
    {
      "medication": "exact medication name as given",
      "type": "one of the exact type keys listed above — e.g. drug-alcohol, drug-food, warnings",
      "summary": "2-3 plain-English sentences a patient can easily understand. No medical jargon.",
      "severity": "mild",
      "recommendation": "One clear, actionable sentence telling the patient what to do."
    }
  ]
}

Rules:
- You MUST return exactly ${totalEntries} entries — one for every medication × type combination
- The "type" field MUST be one of these exact strings: ${interactionTypes.map((t) => `"${t}"`).join(", ")} — no variations, no capitals, no underscores
- "severity" must be exactly "mild", "moderate", or "severe" — nothing else
- If FDA data says "(no FDA data available)", use your general pharmacology knowledge to still provide a useful answer
- Never use abbreviations or medical jargon
- "recommendation" must always start with an action word (e.g. "Avoid...", "Talk to...", "Take...", "Do not...")`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.status(200).json(result);
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ message: "AI analysis failed. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
