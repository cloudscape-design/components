// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import { PageObject } from './page-object';

describe('use-breakpoint-query', () => {
  const setupTest = (testFn: (page: PageObject) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new PageObject(browser);
      await browser.url('#/light/container-queries');
      await testFn(page);
    });
  };

  test(
    `returns correct breakpoints`,
    setupTest(async page => {
      await page.waitForVisible('#test-breakpoints');
      await page.resizeWindow(1000, 500);
      await expect(page.getElementsText('#test-breakpoints')).resolves.toEqual([`s`]);
      await page.resizeWindow(1300, 500);
      await expect(page.getElementsText('#test-breakpoints')).resolves.toEqual([`m`]);
    })
  );

  test(
    `returns the next smallest breakpoint if filter is missing`,
    setupTest(async page => {
      await page.waitForVisible('#test-breakpoints-filter');
      await page.resizeWindow(1300, 500);
      await expect(page.getElementsText('#test-breakpoints-filter')).resolves.toEqual([`s`]);
    })
  );

  test(
    `returns default if all values are filtered`,
    setupTest(async page => {
      await page.waitForVisible('#test-breakpoints-filter-all');
      await page.resizeWindow(1300, 500);
      await expect(page.getElementsText('#test-breakpoints-filter-all')).resolves.toEqual([`default`]);
    })
  );
});
