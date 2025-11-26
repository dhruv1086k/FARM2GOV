import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],

  // Only needed for development
  server: {
    host: true,
    port: 3000,
    strictPort: true,

    // DEVELOPMENT PROXY ONLY
    proxy:
      mode === "development"
        ? {
            "/api": "http://localhost:5001",
          }
        : undefined,
  },

  // Production build settings
  build: {
    outDir: "dist",
  },
}));
