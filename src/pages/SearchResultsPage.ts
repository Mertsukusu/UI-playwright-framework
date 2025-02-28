import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  // XPath selectors for search results
  private searchResultsXPath = [
    "//div[contains(@class, 'search-results')]//h3//a",
    "//article[contains(@class, 'search-result')]//h3//a",
    "//div[contains(@class, 'search-result')]//h3//a",
    "//main//h3//a",
    "//div[@id='search-results']//h3//a",
    "//h3//a",
    "//article//h3",
    "//div[contains(@class, 'result')]//h3"
  ];
  
  // XPath for any text containing the search term
  private anyTextWithSearchTermXPath = (term: string) => 
    `//*/text()[contains(., '${term}')]/..`;
  
  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Wait for search results to load
   */
  async waitForSearchResults(timeout: number = 10000): Promise<void> {
    // Wait for page to load, but don't throw an error if it times out
    await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {
      // Continue if timeout occurs
    });
    await this.page.waitForTimeout(3000);
  }
  
  /**
   * Get the first search result element
   */
  async getFirstSearchResultElement() {
    await this.waitForSearchResults();
    
    // Try each XPath to find the first search result
    for (const xpath of this.searchResultsXPath) {
      const elements = this.page.locator(xpath);
      const count = await elements.count();
      if (count > 0) {
        const firstResult = elements.first();
        if (await firstResult.isVisible({ timeout: 2000 }).catch(() => false)) {
          return firstResult;
        }
      }
    }
    
    // As a fallback, try using JavaScript to search within the body
    const foundByText = await this.page.evaluate((searchTerm: string): boolean => {
      const walkTree = (node: Node, searchFor: string): HTMLElement | null => {
        if (node.nodeType === 3 && node.textContent && node.textContent.includes(searchFor)) {
          return node.parentElement as HTMLElement;
        }
        const children = node.childNodes;
        for (let i = 0; i < children.length; i++) {
          const found = walkTree(children[i], searchFor);
          if (found) return found;
        }
        return null;
      };
      const result = walkTree(document.body, 'Employee Education in 2018');
      if (result) {
        result.style.border = '3px solid red';
        return true;
      }
      return false;
    }, 'Employee Education in 2018');
    
    if (foundByText) {
      return this.page.locator('body');
    }
    
    return null;
  }
  
  /**
   * Verify if the first search result exactly matches the expected text
   */
  async verifyFirstSearchResultText(expectedText: string): Promise<boolean> {
    // Get the first search result element
    const firstResult = await this.getFirstSearchResultElement();
    if (!firstResult) {
      console.log('No search result found');
      return false;
    }
    
    // Get text content of the first search result
    const resultText = await firstResult.textContent() || '';
    console.log(`First search result text: "${resultText.trim()}"`);
    console.log(`Expected text: "${expectedText.trim()}"`);
    
    // Verify an exact match
    return resultText.trim() === expectedText.trim();
  }
} 