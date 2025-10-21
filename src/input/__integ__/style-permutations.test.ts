// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

class InputStylePermutationsPage extends BasePageObject {
  async getComputedStyle(index: number, property: string) {
    const selector = createWrapper()
      .findAllInputs()
      .get(index + 1)
      .findNativeInput()
      .toSelector();
    const element = await this.browser.$(selector);
    return this.browser.execute(
      (el, prop) => {
        return window.getComputedStyle(el as Element).getPropertyValue(prop);
      },
      element,
      property
    );
  }
}

describe('Input Style Permutations', () => {
  const setupTest = (testFn: (page: InputStylePermutationsPage) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new InputStylePermutationsPage(browser);
      await browser.url('#/light/input/style-permutations');
      await page.waitForVisible(createWrapper().findInput().toSelector());
      await testFn(page);
    });
  };

  // Index 0: Teal theme, enabled, valid
  test(
    'teal theme (index 0) - border-radius 8px',
    setupTest(async page => {
      const value = await page.getComputedStyle(0, 'border-radius');
      expect(value).toBe('8px');
    })
  );

  test(
    'teal theme (index 0) - border-width 2px',
    setupTest(async page => {
      const value = await page.getComputedStyle(0, 'border-width');
      expect(value).toBe('2px');
    })
  );

  test(
    'teal theme (index 0) - border-color #14b8a6',
    setupTest(async page => {
      const value = await page.getComputedStyle(0, 'border-color');
      expect(value).toBe('rgb(20, 184, 166)');
    })
  );

  test(
    'teal theme (index 0) - background-color #f0fdfa',
    setupTest(async page => {
      const value = await page.getComputedStyle(0, 'background-color');
      expect(value).toBe('rgb(240, 253, 250)');
    })
  );

  test(
    'teal theme (index 0) - color #0f766e',
    setupTest(async page => {
      const value = await page.getComputedStyle(0, 'color');
      expect(value).toBe('rgb(15, 118, 110)');
    })
  );

  // Index 1: Red theme, enabled, valid
  test(
    'red theme (index 1) - border-color #ef4444',
    setupTest(async page => {
      const value = await page.getComputedStyle(1, 'border-color');
      expect(value).toBe('rgb(239, 68, 68)');
    })
  );

  test(
    'red theme (index 1) - background-color #fef2f2',
    setupTest(async page => {
      const value = await page.getComputedStyle(1, 'background-color');
      expect(value).toBe('rgb(254, 242, 242)');
    })
  );

  test(
    'red theme (index 1) - color #991b1b',
    setupTest(async page => {
      const value = await page.getComputedStyle(1, 'color');
      expect(value).toBe('rgb(153, 27, 27)');
    })
  );

  test(
    'red theme (index 1) - border-radius 8px',
    setupTest(async page => {
      const value = await page.getComputedStyle(1, 'border-radius');
      expect(value).toBe('8px');
    })
  );

  // Index 2: Orange theme, enabled, valid
  test(
    'orange theme (index 2) - border-radius 12px',
    setupTest(async page => {
      const value = await page.getComputedStyle(2, 'border-radius');
      expect(value).toBe('12px');
    })
  );

  test(
    'orange theme (index 2) - border-color #f59e0b',
    setupTest(async page => {
      const value = await page.getComputedStyle(2, 'border-color');
      expect(value).toBe('rgb(245, 158, 11)');
    })
  );

  test(
    'orange theme (index 2) - background-color #fffbeb',
    setupTest(async page => {
      const value = await page.getComputedStyle(2, 'background-color');
      expect(value).toBe('rgb(255, 251, 235)');
    })
  );

  test(
    'orange theme (index 2) - color #92400e',
    setupTest(async page => {
      const value = await page.getComputedStyle(2, 'color');
      expect(value).toBe('rgb(146, 64, 14)');
    })
  );

  // Index 3: Purple theme, enabled, valid
  test(
    'purple theme (index 3) - border-radius 16px',
    setupTest(async page => {
      const value = await page.getComputedStyle(3, 'border-radius');
      expect(value).toBe('16px');
    })
  );

  test(
    'purple theme (index 3) - border-color #c084fc',
    setupTest(async page => {
      const value = await page.getComputedStyle(3, 'border-color');
      expect(value).toBe('rgb(192, 132, 252)');
    })
  );

  test(
    'purple theme (index 3) - background-color #faf5ff',
    setupTest(async page => {
      const value = await page.getComputedStyle(3, 'background-color');
      expect(value).toBe('rgb(250, 245, 255)');
    })
  );

  test(
    'purple theme (index 3) - color #6b21a8',
    setupTest(async page => {
      const value = await page.getComputedStyle(3, 'color');
      expect(value).toBe('rgb(107, 33, 168)');
    })
  );

  // Index 4: Green theme, enabled, valid
  test(
    'green theme (index 4) - border-width 3px',
    setupTest(async page => {
      const value = await page.getComputedStyle(4, 'border-width');
      expect(value).toBe('3px');
    })
  );

  test(
    'green theme (index 4) - border-color #10b981',
    setupTest(async page => {
      const value = await page.getComputedStyle(4, 'border-color');
      expect(value).toBe('rgb(16, 185, 129)');
    })
  );

  test(
    'green theme (index 4) - background-color #ffffff',
    setupTest(async page => {
      const value = await page.getComputedStyle(4, 'background-color');
      expect(value).toBe('rgb(255, 255, 255)');
    })
  );

  test(
    'green theme (index 4) - color #065f46',
    setupTest(async page => {
      const value = await page.getComputedStyle(4, 'color');
      expect(value).toBe('rgb(6, 95, 70)');
    })
  );

  // Index 5: Dark theme, enabled, valid
  test(
    'dark theme (index 5) - border-radius 0px',
    setupTest(async page => {
      const value = await page.getComputedStyle(5, 'border-radius');
      expect(value).toBe('0px');
    })
  );

  test(
    'dark theme (index 5) - border-color #1f2937',
    setupTest(async page => {
      const value = await page.getComputedStyle(5, 'border-color');
      expect(value).toBe('rgb(31, 41, 55)');
    })
  );

  test(
    'dark theme (index 5) - background-color #ffffff',
    setupTest(async page => {
      const value = await page.getComputedStyle(5, 'background-color');
      expect(value).toBe('rgb(255, 255, 255)');
    })
  );

  test(
    'dark theme (index 5) - color #000000',
    setupTest(async page => {
      const value = await page.getComputedStyle(5, 'color');
      expect(value).toBe('rgb(0, 0, 0)');
    })
  );

  // Index 6: Violet theme with custom typography, enabled, valid
  test(
    'violet theme (index 6) - font-size 22px',
    setupTest(async page => {
      const value = await page.getComputedStyle(6, 'font-size');
      expect(value).toBe('22px');
    })
  );

  test(
    'violet theme (index 6) - font-weight 700',
    setupTest(async page => {
      const value = await page.getComputedStyle(6, 'font-weight');
      expect(value).toBe('700');
    })
  );

  test(
    'violet theme (index 6) - padding-top 20px',
    setupTest(async page => {
      const value = await page.getComputedStyle(6, 'padding-top');
      expect(value).toBe('20px');
    })
  );

  test(
    'violet theme (index 6) - padding-bottom 20px',
    setupTest(async page => {
      const value = await page.getComputedStyle(6, 'padding-bottom');
      expect(value).toBe('20px');
    })
  );

  test(
    'violet theme (index 6) - padding-left 28px',
    setupTest(async page => {
      const value = await page.getComputedStyle(6, 'padding-left');
      expect(value).toBe('28px');
    })
  );

  test(
    'violet theme (index 6) - padding-right 28px',
    setupTest(async page => {
      const value = await page.getComputedStyle(6, 'padding-right');
      expect(value).toBe('28px');
    })
  );

  test(
    'violet theme (index 6) - border-color #a78bfa',
    setupTest(async page => {
      const value = await page.getComputedStyle(6, 'border-color');
      expect(value).toBe('rgb(167, 139, 250)');
    })
  );

  test(
    'violet theme (index 6) - background-color #faf5ff',
    setupTest(async page => {
      const value = await page.getComputedStyle(6, 'background-color');
      expect(value).toBe('rgb(250, 245, 255)');
    })
  );

  test(
    'violet theme (index 6) - color #5b21b6',
    setupTest(async page => {
      const value = await page.getComputedStyle(6, 'color');
      expect(value).toBe('rgb(91, 33, 182)');
    })
  );

  // Index 14: Teal theme, disabled, valid
  test(
    'teal theme disabled (index 14) - border-color #99f6e4',
    setupTest(async page => {
      const value = await page.getComputedStyle(14, 'border-color');
      expect(value).toBe('rgb(153, 246, 228)');
    })
  );

  test(
    'teal theme disabled (index 14) - color #0d9488',
    setupTest(async page => {
      const value = await page.getComputedStyle(14, 'color');
      expect(value).toBe('rgb(13, 148, 136)');
    })
  );

  test(
    'teal theme disabled (index 14) - background-color #ccfbf1',
    setupTest(async page => {
      const value = await page.getComputedStyle(14, 'background-color');
      expect(value).toBe('rgb(204, 251, 241)');
    })
  );

  // Index 15: Red theme, disabled, valid
  test(
    'red theme disabled (index 15) - border-color #fca5a5',
    setupTest(async page => {
      const value = await page.getComputedStyle(15, 'border-color');
      expect(value).toBe('rgb(252, 165, 165)');
    })
  );

  test(
    'red theme disabled (index 15) - background-color #fee2e2',
    setupTest(async page => {
      const value = await page.getComputedStyle(15, 'background-color');
      expect(value).toBe('rgb(254, 226, 226)');
    })
  );

  test(
    'red theme disabled (index 15) - color #b91c1c',
    setupTest(async page => {
      const value = await page.getComputedStyle(15, 'color');
      expect(value).toBe('rgb(185, 28, 28)');
    })
  );

  // Index 18: Green theme, disabled, valid
  test(
    'green theme disabled (index 18) - border-width 3px',
    setupTest(async page => {
      const value = await page.getComputedStyle(18, 'border-width');
      expect(value).toBe('3px');
    })
  );

  test(
    'green theme disabled (index 18) - border-color #6ee7b7',
    setupTest(async page => {
      const value = await page.getComputedStyle(18, 'border-color');
      expect(value).toBe('rgb(110, 231, 183)');
    })
  );

  test(
    'green theme disabled (index 18) - background-color #d1fae5',
    setupTest(async page => {
      const value = await page.getComputedStyle(18, 'background-color');
      expect(value).toBe('rgb(209, 250, 229)');
    })
  );

  test(
    'green theme disabled (index 18) - color #047857',
    setupTest(async page => {
      const value = await page.getComputedStyle(18, 'color');
      expect(value).toBe('rgb(4, 120, 87)');
    })
  );
});
