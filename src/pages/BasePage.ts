import { Page, Locator } from '@playwright/test';
import { Driver } from '../utils/Driver';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get configuration from .env
const waitTime = parseInt(process.env.WAIT_TIME || '5000');

export class BasePage {
  protected page: Page;
  protected driver: Driver;
  
  constructor(page: Page) {
    this.page = page;
    this.driver = Driver.getInstance(page);
  }
  
  /**
   * Take a screenshot with a descriptive name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.driver.takeScreenshot(name);
  }
  
  /**
   * Get element by selector
   * @param selector - Element selector (xpath or id)
   */
  getElement(selector: string): Locator {
    return this.page.locator(selector);
  }
  
  /**
   * Click on an element
   * @param selector - Element selector
   */
  async click(selector: string): Promise<void> {
    try {
      // First try standard click with first matching element
      await this.page.locator(selector).first().click({ timeout: 5000 });
    } catch (error) {
      console.log(`Standard click failed, trying JS click for selector: ${selector}`);
      
      // Try clicking via JavaScript evaluation if standard click fails
      const elementHandle = await this.page.locator(selector).first();
      if (elementHandle) {
        await elementHandle.evaluate(node => {
          if (node instanceof HTMLElement) {
            node.click();
          }
        });
        // Wait a bit after JS click
        await this.page.waitForTimeout(1000);
      } else {
        throw new Error(`Failed to find element with selector: ${selector}`);
      }
    }
  }
  
  /**
   * Type text into an input field
   * @param selector - Input field selector
   * @param text - Text to type
   */
  async type(selector: string, text: string, delay: number = 100): Promise<void> {
    try {
      // Use first matching element
      const element = this.page.locator(selector).first();
      await element.clear({ timeout: 5000 });
      await element.fill(text, { timeout: 5000 });
    } catch (error) {
      console.log(`Standard fill failed, trying JS approach for selector: ${selector}`);
      
      try {
        // Try using JavaScript to enter text
        const elementHandle = await this.page.locator(selector).first();
        if (elementHandle) {
          await elementHandle.evaluate((node, value) => {
            if (node instanceof HTMLInputElement) {
              node.value = '';
              node.value = value;
              // Trigger input event to activate any listeners
              node.dispatchEvent(new Event('input', { bubbles: true }));
              node.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }, text);
          // Wait a bit after JS input
          await this.page.waitForTimeout(1000);
        } else {
          throw new Error(`Failed to find input element with selector: ${selector}`);
        }
      } catch (jsError) {
        // Last resort: try keyboard typing directly
        console.log(`JS approach failed, trying keyboard typing`);
        // First click the element to focus it
        await this.click(selector);
        // Clear existing text with keyboard shortcuts
        await this.page.keyboard.press('Control+A');
        await this.page.keyboard.press('Backspace');
        // Type the new text
        await this.page.keyboard.type(text, { delay });
      }
    }
  }
  
  /**
   * Get text from an element
   * @param selector - Element selector
   * @returns Text content of the element
   */
  async getText(selector: string): Promise<string> {
    return await this.getElement(selector).textContent() || '';
  }
  
  /**
   * Check if element is visible
   * @param selector - Element selector
   * @returns True if element is visible
   */
  async isVisible(selector: string, timeout: number = 5000): Promise<boolean> {
    return await this.getElement(selector).isVisible({ timeout }).catch(() => false);
  }
  
  /**
   * Wait for element to be visible
   * @param selector - Element selector
   * @param timeout - Timeout in milliseconds
   */
  async waitForVisible(selector: string, timeout: number = 10000): Promise<void> {
    await this.getElement(selector).waitFor({ state: 'visible', timeout });
  }
  
  /**
   * Verify minimum length of text in an element
   * @param selector - Element selector
   * @param minLength - Minimum required length
   * @returns True if text length meets the requirement
   */
  async verifyTextMinLength(selector: string, minLength: number): Promise<boolean> {
    const text = await this.getText(selector);
    return text.length >= minLength;
  }
  
  /**
   * Verify exact text match
   * @param selector - Element selector 
   * @param expectedText - Expected text
   * @returns True if text matches exactly
   */
  async verifyExactText(selector: string, expectedText: string): Promise<boolean> {
    const actualText = await this.getText(selector);
    console.log(`Actual text: "${actualText.trim()}"`);
    console.log(`Expected text: "${expectedText.trim()}"`);
    return actualText.trim() === expectedText.trim();
  }
  
  /**
   * Scroll to bottom of page
   */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight * 0.8);
    });
    
    // Wait for the specified time from .env
    await this.page.waitForTimeout(waitTime);
  }
  
  /**
   * Simple search function that can be reused across pages
   * @param searchIconSelector - Selector for search icon
   * @param searchInputSelector - Selector for search input
   * @param searchButtonSelector - Selector for search button
   * @param searchTerm - Text to search for
   */
  async performSearch(
    searchIconSelector: string,
    searchInputSelector: string,
    searchButtonSelector: string,
    searchTerm: string
  ): Promise<void> {
    // Click search icon
    await this.click(searchIconSelector);
    await this.page.waitForTimeout(500);
    
    // Type search term
    await this.type(searchInputSelector, searchTerm);
    await this.page.waitForTimeout(500);
    
    // Click search button
    await this.click(searchButtonSelector);
    
    // Wait for page load
    await this.waitForPageLoad();
    await this.page.waitForTimeout(2000);
  }
  
  /**
   * Wait for page to fully load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);
  }
} 