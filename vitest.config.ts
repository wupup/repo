import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          globals: true,
          name: 'utils',
          include: ['packages/utils/__test__/**/*.{test,spec}.{js,ts,jsx,tsx}'],
          environment: 'node',
        },
      },

      {
        plugins: [vue()],
        test: {
          globals: true,
          name: 'components',
          include: ['packages/components/__test__/**/*.{test,spec}.{js,ts,jsx,tsx}'],
          browser: {
            enabled: true,
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
});
