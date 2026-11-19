// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

class GlobalThemeIframesPage extends BasePageObject {
  async getAppliedColorInsideIframe(iframeSelector: string): Promise<string> {
    let color = '';
    await this.runInsideIframe(iframeSelector, true, async () => {
      await this.waitForVisible('[data-testid="themed-element"]');
      color = await this.browser.execute(() => {
        return getComputedStyle(document.querySelector('[data-testid="themed-element"]')!)
          .getPropertyValue('color')
          .trim();
      });
    });
    return color;
  }

  async waitForIframeColor(iframeSelector: string, expectedColor: string): Promise<void> {
    await this.browser.waitUntil(
      async () => {
        const color = await this.getAppliedColorInsideIframe(iframeSelector);
        return color === expectedColor;
      },
      { timeout: 5000, timeoutMsg: `Expected color "${expectedColor}" in ${iframeSelector} but did not match in time` }
    );
  }

  setThemeA() {
    return this.click('[data-testid="set-theme-a"]');
  }

  setThemeB() {
    return this.click('[data-testid="set-theme-b"]');
  }

  getCurrentTheme(): Promise<string> {
    return this.getText('[data-testid="current-theme"]');
  }

  async waitForIframesDisplay(): Promise<void> {
    await this.runInsideIframe('#iframe-1', true, async () => {
      await this.waitForVisible('[data-testid="themed-element"]');
    });
    await this.runInsideIframe('#iframe-2', true, async () => {
      await this.waitForVisible('[data-testid="themed-element"]');
    });
  }
}

const setupTest = (testFn: (page: GlobalThemeIframesPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new GlobalThemeIframesPage(browser);
    await browser.url('#/light/theming/global-theme-iframes');
    await page.waitForVisible('[data-testid="set-theme-a"]');
    await page.waitForIframesDisplay();
    await testFn(page);
  });
};

describe('Global theme with multiple iframes', () => {
  test(
    'applies theme to iframes after setGlobalTheme is called',
    setupTest(async page => {
      await page.setThemeA();

      await page.waitForIframeColor('#iframe-1', 'rgb(255, 0, 0)');
      await page.waitForIframeColor('#iframe-2', 'rgb(255, 0, 0)');
    })
  );

  test(
    'propagates theme changes to all iframes',
    setupTest(async page => {
      await page.setThemeA();
      await page.waitForIframeColor('#iframe-1', 'rgb(255, 0, 0)');
      await page.waitForIframeColor('#iframe-2', 'rgb(255, 0, 0)');

      await page.setThemeB();

      await page.waitForIframeColor('#iframe-1', 'rgb(0, 0, 255)');
      await page.waitForIframeColor('#iframe-2', 'rgb(0, 0, 255)');
    })
  );

  test(
    'both iframes receive the same theme value',
    setupTest(async page => {
      await page.setThemeA();
      await page.waitForIframeColor('#iframe-1', 'rgb(255, 0, 0)');
      await page.waitForIframeColor('#iframe-2', 'rgb(255, 0, 0)');
    })
  );

  test(
    'switching themes multiple times applies the latest theme',
    setupTest(async page => {
      await page.setThemeA();
      await page.setThemeB();
      await page.setThemeA();

      await page.waitForIframeColor('#iframe-1', 'rgb(255, 0, 0)');
      await page.waitForIframeColor('#iframe-2', 'rgb(255, 0, 0)');
    })
  );
});
