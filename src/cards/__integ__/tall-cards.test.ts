// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await page.setWindowSize({ width: 1000, height: 1600 });
    await browser.url('#/light/cards/tall-cards');
    await testFn(page);
  });
};

test(
  'card is scrolled to top when focused with keyboard',
  setupTest(async page => {
    await page.click(`#button-0`);
    await page.elementScrollTo('#overflow-parent', { top: 200 });

    const elementScrollBeforeFocus = await page.getElementScroll('#overflow-parent');
    expect(elementScrollBeforeFocus.top).toBe(200);

    await page.keys(['Tab']);

    const elementScrollAfterFocus = await page.getElementScroll('#overflow-parent');
    expect(elementScrollAfterFocus.top).toBeLessThan(200);
  })
);

test(
  'card is not scrolled to top when focused with mouse click',
  setupTest(async page => {
    await page.elementScrollTo('#overflow-parent', { top: 200 });

    const elementScrollBeforeFocus = await page.getElementScroll('#overflow-parent');
    expect(elementScrollBeforeFocus.top).toBe(200);

    await page.click('#button-1');

    const elementScrollAfterFocus = await page.getElementScroll('#overflow-parent');
    expect(elementScrollAfterFocus.top).toBe(200);
  })
);
