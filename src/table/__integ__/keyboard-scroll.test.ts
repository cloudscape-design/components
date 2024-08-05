// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

import styles from '../../../lib/components/table/styles.selectors.js';

test(
  'allows to scroll overflowing table by focusing the wrapper',
  useBrowser({ width: 375, height: 871 }, async browser => {
    const tableWrapper = createWrapper().findTable('[data-testid="items-table"]');
    const wrapperSelector = tableWrapper.findAllByClassName(styles.wrapper).toSelector();
    await browser.url('#/light/table/keyboard-scroll');
    const page = new BasePageObject(browser);
    await page.click('h1');
    await page.keys('Tab');

    await expect(page.isFocused(wrapperSelector)).resolves.toBeTruthy();

    let leftBefore = 0;
    let leftAfter = 0;

    await page.keys('ArrowRight');
    await page.waitForAssertion(async () => {
      const result = await page.getElementScroll(wrapperSelector);
      leftBefore = result.left;
      expect(leftBefore).toBeGreaterThan(0);
    });

    await page.keys('ArrowLeft');
    await page.waitForAssertion(async () => {
      const result = await page.getElementScroll(wrapperSelector);
      leftAfter = result.left;
      expect(leftAfter).toBeLessThan(leftBefore);
    });

    await page.setWindowSize({ width: 800, height: 871 });
    await page.click('h1');
    await page.keys('Tab');
    await expect(page.isFocused(wrapperSelector)).resolves.toBeFalsy();
  })
);
