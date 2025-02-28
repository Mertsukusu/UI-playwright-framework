# Bright Horizons UI Test Framework

A comprehensive Playwright-based automated testing framework for the Bright Horizons website. This framework follows Page Object Model design patterns.

## Project Structure

```
bright-horizon-UI-Test-playwright-framework/
├── src/
│   ├── pages/          # Page Object Models
│   │   ├── BasePage.ts  # Base page with common methods
│   │   ├── HomePage.ts  # Home page specific methods
│   │   └── SearchResultsPage.ts # Search results page methods
│   └── utils/           # Utility classes
├── tests/              # Test files
│   └── brightHorizons.test.ts  # Main test file
├── test-results/       # Test outputs and screenshots
├── playwright.config.ts # Playwright configuration
└── package.json        # Project dependencies
```

## Prerequisites

- Node.js (v14 or later)
- npm (v7 or later)
- Visual Studio Code (recommended for development)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd bright-horizon-UI-Test-playwright-framework
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

4. Install the Playwright Test Extension for VS Code:

   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X on Mac)
   - Search for "Playwright Test"
   - Click Install

   This extension provides:

   - Code highlighting for Playwright test files
   - Intellisense for Playwright APIs
   - Test debugging capabilities
   - Test runner integration in VS Code

## Configuration

The framework uses environment variables for configuration. Create a `.env` file in the root directory:

```
BASE_URL=https://www.brighthorizons.com
WAIT_TIME=5000
SCREENSHOT_DIR=./test-results
```

## Running Tests

### Using Command Line

Run all tests in headless mode:

```bash
npx playwright test
```

Run tests with browser UI:

```bash
npx playwright test --headed
```

Run specific test file:

```bash
npx playwright test tests/brightHorizons.test.ts --headed
```

Run tests with debug mode:

```bash
npx playwright test --debug
```

### Using VS Code Playwright Extension

1. Open the test file in VS Code
2. Click the "Run Test" or "Debug Test" CodeLens above the test
3. Use the Testing sidebar to run/debug tests
