import { defineConfig } from "eslint/config";
import pluginVue from "eslint-plugin-vue";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vueParser from "vue-eslint-parser";
import globals from "globals";

export default defineConfig({
  plugins: {
    vue: pluginVue,
    "@typescript-eslint": tsPlugin,
  },
  languageOptions: {
    parser: vueParser,
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      ...globals.browser,
    },
    parserOptions: {
      parser: tsParser,
      extraFileExtensions: [".vue"],
    },
  },
});
