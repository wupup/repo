import { defineConfig } from "eslint/config";
import jsEslint from "@eslint/js";
import tsEslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";

const ignores = [
  "**/node_modules/**",
  "**/dist/**",
  "scripts/**",
  "**/*.d.ts",
  "*.config.js",
];

export default defineConfig(
  // 通用配置
  {
    ignores,
    extends: [
      jsEslint.configs.recommended,
      ...tsEslint.configs.recommended,
      eslintConfigPrettier,
    ],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsEslint.parser,
    },
    rules: {
      "no-var": "error",
      // "no-unused-vars": "warn",
      "no-console": "off",
      "prettier/prettier": "error",
    },
  },

  // 前端配置
  {
    ignores,
    files: [
      "apps/**/*.{js,ts,jsx,tsx,vue}",
      "packages/components/**/*.{js,ts,jsx,tsx,vue}",
      "docs/**/*.{js,ts,jsx,tsx,vue}",
    ],
    extends: [...eslintPluginVue.configs["flat/recommended"]],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // 前端配置
  {
    ignores,
    files: ["apps/backend/**/*.{js,ts}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
);
