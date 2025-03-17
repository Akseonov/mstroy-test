import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";
import vueParser from "vue-eslint-parser";

export default tseslint.config(
  { ignores: ["dist", "build", "node_modules"] },
  js.configs.recommended,
  {
    files: ["**/*.{ts,vue,js}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
    },
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-undef": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx,vue}"],
    languageOptions: {
      parser: tseslint.parser,
    },
  },
  // ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser, // parse TS inside VUE
      },
    },
  },
  eslintConfigPrettier,
);
