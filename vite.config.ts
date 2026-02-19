import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/MP4/",   // ← IMPORTANT FOR GITHUB PAGES
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});