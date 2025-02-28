import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // XPath selectors as requested
  private searchIconXPath = "//a[@id='search-toggle'] | //a[contains(@class, 'search')] | //button[contains(@class, 'search')]";
  private searchInputXPath = "//input[@id='search-field'][1]";
  private searchButtonXPath = "//button[@type='submit']";
  
  // Footer XPath selectors
  private footerSectionsXPath = "//footer//div[contains(@class, 'col') or contains(@class, 'column')]";
  private footerSectionTitlesXPath = "//footer//h3 | //footer//div[contains(@class, 'title')]";
  
  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Wait for page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.driver.waitForPageLoad();
  }
  
  /**
   * Scroll to bottom of page
   */
  async scrollToBottom(): Promise<void> {
    await this.driver.scrollToBottom();
  }
  
  /**
   * Get all footer section titles
   */
  async getFooterSectionTitles(): Promise<string[]> {
    const titles = await this.page.locator(this.footerSectionTitlesXPath).allTextContents();
    return titles.map(title => title.trim()).filter(title => title.length > 0);
  }

  /**
   * Perform search with the given term
   */
  async performSearch(searchTerm: string): Promise<void> {
    // First ensure we're at the top of the page
    await this.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await this.page.waitForTimeout(1000);
    
    // Take screenshot before attempting search
    await this.takeScreenshot('before-search-attempt');
    
    // Use the reusable search method from BasePage
    await super.performSearch(
      this.searchIconXPath,
      this.searchInputXPath,
      this.searchButtonXPath,
      searchTerm
    );
    
    // Take screenshot after search
    await this.takeScreenshot('after-search-completed');
  }
} 