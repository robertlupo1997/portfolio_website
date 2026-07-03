import { defineConfig } from '@playwright/test';
export default defineConfig({
  testMatch: ['tests/**/*.spec.ts', 'e2e/**/*.spec.ts'],
  use: { baseURL: 'http://localhost:3000' },
  webServer: { command: 'npm run dev', port: 3000, reuseExistingServer: true },
});
