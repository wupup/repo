import { defineConfig } from 'eslint/config';
import jsEslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

const ignores = ['**/node_modules/**', '**/dist/**', 'scripts/**', 'libs/**', '**/*.d.ts', '*.config.js', '**/*.md'];

export default defineConfig(
  // 通用配置
  {
    ignores,
    extends: [jsEslint.configs.recommended, ...tsEslint.configs.recommended, eslintConfigPrettier],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsEslint.parser,
    },
    rules: {
      'no-var': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      'prettier/prettier': 'error',
    },
  },

  // 前端配置
  {
    ignores,
    files: ['apps/**/*.{js,ts,jsx,tsx,vue}', 'packages/**/*.{js,ts,jsx,tsx,vue}', 'docs/**/*.{js,ts,jsx,tsx,vue}'],
    extends: [...eslintPluginVue.configs['flat/recommended']],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    },
  },

  // 后端配置
  {
    ignores,
    files: ['apps/backend/**/*.{js,ts}', 'scripts/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
);
