import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// REVIEW: Consider a dev server proxy to backend (e.g. /api -> localhost:3001) for relative URLs and fewer CORS surprises.
export default defineConfig({
  // Use relative asset paths so the app also works on GitHub Pages subpaths.
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend"),
    },
  },
  assetsInclude: ["**/*.svg", "**/*.csv"],
});
