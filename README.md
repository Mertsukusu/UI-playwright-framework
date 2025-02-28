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

### View Test Report

After test execution, view the HTML report:

```bash
npx playwright show-report
```

## Framework Features

- **Page Object Model (POM)** - Separates test logic from page interactions
- **XPath Selectors** - Uses XPath for element identification
- **Reusable Methods** - Common actions abstracted into reusable methods
- **Screenshot Capture** - Automatic screenshots at key test steps
- **Error Handling** - Robust error handling for reliable test execution
- **TypeScript** - Type-safe code to prevent runtime errors

## Test Scenario Covered

The main test scenario includes:

1. **Navigation** - Navigate to Bright Horizons website
2. **Footer Validation** - Scroll to bottom and verify 4 footer sections with titles (min 15 characters)
3. **Search Functionality** - Click search icon and search for "Employee Education in 2018: Strategies to Watch"
4. **Result Validation** - Verify the first search result exactly matches the search term

## Extending the Framework

### Adding New Page Objects

1. Create a new file in `src/pages` directory
2. Extend the BasePage class
3. Implement page-specific methods

Example:

```typescript
import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class NewPage extends BasePage {
  private myElementXPath = "//xpath/to/element";

  constructor(page: Page) {
    super(page);
  }

  async myMethod(): Promise<void> {
    // Implementation
  }
}
```

### Adding New Tests

1. Create a new test file in the `tests` directory
2. Import required page objects
3. Write your test using the Page Object Model pattern

Example:

```typescript
import { test, expect } from "@playwright/test";
import { HomePage } from "../src/pages/HomePage";

test("My new test", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
  // Test steps
});
```

## Troubleshooting

- **Element Not Found**: Check if the XPath selector is correct or if the element is inside an iframe
- **Timing Issues**: Increase the wait time in the `.env` file
- **Browser Issues**: Try with different browsers (chromium, firefox, webkit)
- **Screenshots**: Check the test-results directory for screenshots to debug issues

## Best Practices

- Keep tests independent and isolated
- Follow Page Object Model principles
- Implement explicit waits instead of fixed timeouts where possible
- Use descriptive test and method names
- Add proper error handling for reliable tests

## Contributors

- [Your Name/Team] - Initial implementation
