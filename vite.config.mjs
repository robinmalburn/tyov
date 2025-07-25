import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
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
