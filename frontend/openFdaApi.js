// REVIEW: Document VITE_API_BASE_URL in .env.example; without it, non-localhost deploys hit OpenFDA directly (rate limits, no unified error handling).
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const IS_LOCALHOST =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const USE_BACKEND_PROXY =
  Boolean(import.meta.env.VITE_API_BASE_URL) || IS_LOCALHOST;

async function fetchJson(url) {
  const response = await fetch(url);
  // REVIEW: Assumes JSON body on all responses; non-JSON error pages will throw before surfacing status text.
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || data?.error?.message || "Request failed");
  }
  return data;
}

async function fetchWithBackendFallback(primaryUrl, fallbackUrl) {
  try {
    return await fetchJson(primaryUrl);
  } catch (error) {
    if (primaryUrl === fallbackUrl) {
      throw error;
    }
    return fetchJson(fallbackUrl);
  }
}

export async function fetchMedicationSuggestions(searchMedication) {
  const medicationQuery = encodeURIComponent(searchMedication.trim());
  const proxyUrl = `${API_BASE_URL}/api/openfda/search?name=${medicationQuery}`;
  const directUrl = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${medicationQuery}*&limit=10`;
  const data = await fetchWithBackendFallback(
    USE_BACKEND_PROXY ? proxyUrl : directUrl,
    directUrl,
  );
  return data.results ?? [];
}

export async function fetchMedicationLabel(medication) {
  const medicationQuery = encodeURIComponent(medication);
  const proxyUrl = `${API_BASE_URL}/api/openfda/label?name=${medicationQuery}`;
  const directUrl = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:%22${medicationQuery}%22&limit=1`;
  const data = await fetchWithBackendFallback(
    USE_BACKEND_PROXY ? proxyUrl : directUrl,
    directUrl,
  );
  return data.results?.[0] || null;
}
