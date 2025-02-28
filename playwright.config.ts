import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get browser from .env
const browserType = process.env.BROWSER?.toLowerCase() || 'chromium';
const baseURL = process.env.BASE_URL || 'https://www.brighthorizons.com';

// Configure the browser project based on .env
const getBrowserConfig = () => {
  switch(browserType) {
    case 'firefox':
      return { name: 'firefox', use: { ...devices['Desktop Firefox'] } };
    case 'webkit':
    case 'safari':
      return { name: 'webkit', use: { ...devices['Desktop Safari'] } };
    case 'edge':
      return { name: 'edge', use: { ...devices['Desktop Edge'] } };
    case 'chromium':
    default:
      return { name: 'chromium', use: { ...devices['Desktop Chrome'] } };
  }
};

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: {
    timeout: 10000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 15000,
    baseURL: baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    headless: false,
  },
  projects: [getBrowserConfig()],
}); 