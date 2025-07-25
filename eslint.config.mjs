import { defineConfig } from "eslint/config";
import pluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import globals from "globals";

export default defineConfig({
  plugins: {
    vue: pluginVue,
  },
  languageOptions: {
    parser: vueParser,
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      ...globals.browser,
    },
  },
});
