import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: true,
    port: 3000,
    strictPort: true,
    allowedHosts: ["05498596c4e0.ngrok-free.app", "*.ngrok-free.app"],

    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
