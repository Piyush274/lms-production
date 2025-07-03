/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      components: `${path.resolve(__dirname, "./src/components")}`,
      // routes: `${path.resolve(__dirname, "./src/routes")}`,
      store: `${path.resolve(__dirname, "./src/store")}`,
      assets: `${path.resolve(__dirname, "./src/assets")}`,
      utils: `${path.resolve(__dirname, "./src/utils")}`,
      services: `${path.resolve(__dirname, "./src/services")}`,
      pages: `${path.resolve(__dirname, "./src/pages")}`,
    },
  },
});
