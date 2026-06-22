const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const IS_LOCALHOST =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const HAS_AI_BACKEND =
  Boolean(import.meta.env.VITE_API_BASE_URL) || IS_LOCALHOST;

async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || data?.error?.message || "Request failed");
  }
  return data;
}

export async function fetchMedicationSuggestions(searchMedication) {
  const medicationQuery = encodeURIComponent(searchMedication.trim());
  const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${medicationQuery}*&limit=10`;
  const data = await fetchJson(url);
  return data.results ?? [];
}

export async function fetchMedicationLabel(medication) {
  const medicationQuery = encodeURIComponent(medication);
  const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:%22${medicationQuery}%22&limit=1`;
  const data = await fetchJson(url);
  return data.results?.[0] || null;
}

const FDA_FIELD_MAP = {
  "drug-drug": "ask_doctor_or_pharmacist",
  "drug-alcohol": "warnings",
  "drug-food": "when_using",
  "pregnancy-breastfeeding": "pregnancy_or_breast_feeding",
  warnings: "warnings",
};

export async function analyzeWithAI(medications, interactionTypes, fdaResults) {
  if (!HAS_AI_BACKEND) {
    throw new Error("AI analysis requires the backend server to be running.");
  }

  // Extract only the relevant FDA text fields
  const fdaData = {};
  medications.forEach((med, index) => {
    const label = fdaResults[index];
    if (!label) return;
    fdaData[med] = {};
    for (const type of interactionTypes) {
      const fieldName = FDA_FIELD_MAP[type];
      const text = label?.[fieldName]?.[0];
      if (text) {
        fdaData[med][type] = text.slice(0, 800);
      }
    }
  });

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ medications, interactionTypes, fdaData }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "AI analysis failed");
  }

  const data = await response.json();
  return data.analyses || [];
}
