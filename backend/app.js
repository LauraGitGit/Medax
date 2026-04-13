const express = require("express");
// REVIEW: db.auth.js exists but is never required—Mongo/JWT flows from README are not wired into this server.

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// CORS for local frontend development (Vite: localhost:5173)
// REVIEW: Access-Control-Allow-Origin * is unsafe for credentialed APIs; restrict to known origins in production.
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

// REVIEW: No rate limiting or caching—OpenFDA quota abuse or thundering herd possible.
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
