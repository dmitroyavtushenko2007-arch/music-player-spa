import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // адреса бекенда на деплої (змінна VITE_API_URL в Netlify); локально порожньо
  define: { __API_URL__: JSON.stringify(process.env.VITE_API_URL || "") },
  server: {
    // усі запити на /api йдуть на FastAPI-сервер
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
