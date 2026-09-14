// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

class ToggleButtonHoverPage extends BasePageObject {
  getBackgroundColor(testId: string) {
    return this.browser.$(`[data-testid="${testId}"]`).getCSSProperty('background-color');
  }

  hover(testId: string) {
    return this.hoverElement(`[data-testid="${testId}"]`);
  }
}

const setupTest = (testFn: (page: ToggleButtonHoverPage) => Promise<void>) =>
  useBrowser(async browser => {
    await browser.url('#/light/toggle-button/test-hover');
    const page = new ToggleButtonHoverPage(browser);
    await page.waitForVisible('[data-testid="variant-normal-enabled-not-pressed"]');
    await testFn(page);
  });

describe('ToggleButton hover', () => {
  test(
    'enabled normal variant changes background on hover',
    setupTest(async page => {
      const testId = 'variant-normal-enabled-not-pressed';
      const before = (await page.getBackgroundColor(testId)).value;
      await page.hover(testId);
      const after = (await page.getBackgroundColor(testId)).value;
      expect(after).not.toBe(before);
    })
  );

  test(
    'disabled normal variant (native `disabled`) does not change background on hover',
    setupTest(async page => {
      const testId = 'variant-normal-disabled-not-pressed';
      const before = (await page.getBackgroundColor(testId)).value;
      await page.hover(testId);
      const after = (await page.getBackgroundColor(testId)).value;
      expect(after).toBe(before);
    })
  );

  test(
    'disabled normal variant with reason (`aria-disabled`) does not change background on hover',
    setupTest(async page => {
      const testId = 'variant-normal-disabled-reason-not-pressed';
      const before = (await page.getBackgroundColor(testId)).value;
      await page.hover(testId);
      const after = (await page.getBackgroundColor(testId)).value;
      expect(after).toBe(before);
    })
  );
});
