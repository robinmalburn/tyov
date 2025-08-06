import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    alias: {
      Libs: "/src/lib",
      Components: "/src/components",
      Migrations: "/src/migrations",
      Stores: "/src/store",
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
});
