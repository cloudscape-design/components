// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

class GlobalThemeIframesPage extends BasePageObject {
  getAppliedColor(iframeSelector: string): Promise<string> {
    return this.browser.execute((selector: string) => {
      const iframe = document.querySelector(selector) as HTMLIFrameElement;
      const iframeDoc = iframe?.contentDocument;
      if (!iframeDoc) {
        return '';
      }

      return getComputedStyle(iframeDoc.querySelector('[data-testid="themed-element"]')!)
        .getPropertyValue('color')
        .trim();
    }, iframeSelector);
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
    await this.browser.waitUntil(
      async () => {
        const ready = await this.browser.execute(() => {
          const iframe1 = document.querySelector('#iframe-1') as HTMLIFrameElement;
          const iframe2 = document.querySelector('#iframe-2') as HTMLIFrameElement;
          const content1 = iframe1?.contentDocument?.querySelector('[data-testid="themed-element"]');
          const content2 = iframe2?.contentDocument?.querySelector('[data-testid="themed-element"]');
          return !!(content1 && content2);
        });
        return ready;
      },
      { timeout: 5000, timeoutMsg: 'Iframes did not display their content in time' }
    );
  }
}

const setupTest = (testFn: (page: GlobalThemeIframesPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new GlobalThemeIframesPage(browser);
    await browser.url('#/light/theming/global-theme-iframes');
    await page.waitForVisible('[data-testid="set-theme-a"]');
    await testFn(page);
  });
};

describe('Global theme with multiple iframes', () => {
  test(
    'applies theme set before iframes are mounted',
    setupTest(async page => {
      await page.setThemeA();
      await expect(page.getCurrentTheme()).resolves.toBe('theme-a');

      await page.waitForIframesDisplay();

      const iframe1Value = await page.getAppliedColor('#iframe-1');
      const iframe2Value = await page.getAppliedColor('#iframe-2');

      expect(iframe1Value).toBe('rgb(255, 0, 0)');
      expect(iframe2Value).toBe('rgb(255, 0, 0)');
    })
  );

  test(
    'propagates theme changes to all iframes',
    setupTest(async page => {
      await page.setThemeA();
      await page.waitForIframesDisplay();

      const iframe1Before = await page.getAppliedColor('#iframe-1');
      const iframe2Before = await page.getAppliedColor('#iframe-2');

      expect(iframe1Before).toBe('rgb(255, 0, 0)');
      expect(iframe2Before).toBe('rgb(255, 0, 0)');

      await page.setThemeB();

      const iframe1After = await page.getAppliedColor('#iframe-1');
      const iframe2After = await page.getAppliedColor('#iframe-2');

      expect(iframe1After).toBe('rgb(0, 0, 255)');
      expect(iframe2After).toBe('rgb(0, 0, 255)');
    })
  );

  test(
    'both iframes receive the same theme value',
    setupTest(async page => {
      await page.setThemeA();
      await page.waitForIframesDisplay();

      const iframe1Value = await page.getAppliedColor('#iframe-1');
      const iframe2Value = await page.getAppliedColor('#iframe-2');

      expect(iframe1Value).toEqual(iframe2Value);
    })
  );

  test(
    'switching themes multiple times applies the latest theme',
    setupTest(async page => {
      await page.setThemeA();
      await page.setThemeB();
      await page.setThemeA();
      await page.waitForIframesDisplay();

      const iframe1Value = await page.getAppliedColor('#iframe-1');
      const iframe2Value = await page.getAppliedColor('#iframe-2');

      expect(iframe1Value).toBe('rgb(255, 0, 0)');
      expect(iframe2Value).toBe('rgb(255, 0, 0)');
    })
  );
});
