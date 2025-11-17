import { Page, expect, Locator, BrowserContext } from '@playwright/test';

export class FooterPage {
  readonly page: Page;
  readonly context: BrowserContext;
  readonly footer: Locator;
  readonly twitterLink: Locator;
  readonly facebookLink: Locator;
  readonly linkedinLink: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    this.footer = page.locator('footer');
    this.twitterLink = page.locator('.footer a[href*="twitter.com"]');
    this.facebookLink = page.locator('.footer a[href*="facebook.com"]');
    this.linkedinLink = page.locator('.footer a[href*="linkedin.com"]');
  }

  async assertFooterVisible() {
    await expect(this.footer).toBeVisible();
  }

  async openLinkAndVerify(link: Locator, expectedDomain: string) {
    const href = await link.getAttribute('href');
    expect(href).not.toBeNull();

    const newPage = await this.context.newPage();
    await newPage.goto(href!);
    await expect(newPage).toHaveURL(new RegExp(expectedDomain));
    await newPage.close();
  }

  async verifyAllSocialLinks() {
    await this.openLinkAndVerify(this.twitterLink, 'x.com');
    await this.openLinkAndVerify(this.facebookLink, 'facebook.com');
    await this.openLinkAndVerify(this.linkedinLink, 'linkedin.com');
  }
}
