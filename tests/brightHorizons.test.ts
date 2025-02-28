import { test, expect, chromium, firefox, webkit } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { SearchResultsPage } from '../src/pages/SearchResultsPage';
import { Driver } from '../src/utils/Driver';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get configuration from .env
const baseUrl = process.env.BASE_URL;
const browserType = process.env.BROWSER || 'chromium';

test('Footer Sections and Search Functionality', async () => {
  // Increase test timeout
  test.setTimeout(120000);

  try {
    // Initialize driver and browser automatically based on .env
    const setup = await Driver.createFromEnv();
    const page = setup.page;
    const driver = setup.driver;
    
    // Initialize page objects
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    
    // Step 1: Navigate to main page
    console.log(`Step 1: Navigating to main page using ${browserType} browser...`);
    await driver.navigateTo(); // Use Driver singleton to navigate
    await homePage.waitForPageLoad();
    await page.waitForTimeout(3000);
    
    // Step 2: Scroll to bottom and verify 4 footer sections
    console.log('Step 2: Scrolling to bottom to verify footer sections...');
    await homePage.scrollToBottom();
    
    // Get all footer section titles
    const titles = await homePage.getFooterSectionTitles();
    console.log(`Found ${titles.length} footer sections.`);
    // Log each section title and its character count
    titles.forEach((title, index) => {
      console.log(`Section ${index + 1} title is "${title}" with ${title.length} characters - assumed fine.`);
    });
    
    // Verify we have at least 4 footer sections
    expect(titles.length).toBeGreaterThanOrEqual(4);
    
    // Verify minimum title length
    const minTitleLength = 15;
    for (let i = 0; i < titles.length; i++) {
      expect(titles[i].length).toBeGreaterThanOrEqual(minTitleLength);
    }
    
    // Take screenshot of footer
    await homePage.takeScreenshot('footer-sections');
    
    // Step 3: Go back to top
    console.log('Step 3: Scrolling back to top...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(3000);
    
    // Step 4: Search for the specified term
    const searchTerm = 'Employee Education in 2018: Strategies to Watch';
    console.log(`Step 4: Searching for "${searchTerm}"...`);
    
    // Perform the search operation
    await homePage.performSearch(searchTerm);
    
    // Step 5: Verify search results
    console.log('Step 5: Verifying search results...');
    
    // Wait a bit longer for search results to load
    await page.waitForTimeout(3000);
    
    try {
      // Try verification with a longer timeout
      const isResultPresent = await searchResultsPage.verifyFirstSearchResultText(searchTerm);
      console.log(`Search result verification: ${isResultPresent ? 'PASSED' : 'FAILED'}`);
      
      // Take a final screenshot of the current state
      await page.screenshot({ path: './test-results/final-state.png', fullPage: true });
      
      // Assert the result
      expect(isResultPresent).toBeTruthy();
    } catch (error) {
      console.error('Error during search verification:', error);
      
      // Take screenshot of error state
      await page.screenshot({ path: './test-results/error-state.png', fullPage: true });
      
      throw error;
    }
    
  } finally {
    // Close browser using the Driver utility
    await Driver.closeBrowser();
  }
}); 