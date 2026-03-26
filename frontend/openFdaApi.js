const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const IS_LOCALHOST =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const USE_BACKEND_PROXY =
  Boolean(import.meta.env.VITE_API_BASE_URL) || IS_LOCALHOST;

function getSearchUrl(medicationQuery) {
  return USE_BACKEND_PROXY
    ? `${API_BASE_URL}/api/openfda/search?name=${medicationQuery}`
    : `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${medicationQuery}*&limit=8`;
}

function getLabelUrl(medicationQuery) {
  return USE_BACKEND_PROXY
    ? `${API_BASE_URL}/api/openfda/label?name=${medicationQuery}`
    : `https://api.fda.gov/drug/label.json?search=openfda.brand_name:%22${medicationQuery}%22&limit=1`;
}

export async function fetchMedicationSuggestions(searchMedication) {
  const medicationQuery = encodeURIComponent(searchMedication.trim());
  const response = await fetch(getSearchUrl(medicationQuery));
  const data = await response.json();
  return data.results ?? [];
}

export async function fetchMedicationLabel(medication) {
  const medicationQuery = encodeURIComponent(medication);
  const response = await fetch(getLabelUrl(medicationQuery));
  const data = await response.json();
  return data.results?.[0] || null;
}
