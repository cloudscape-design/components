// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const tableWrapper = createWrapper().findTable();
const headerSelector = tableWrapper.findHeaderSlot().toSelector();

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await page.setWindowSize({ width: 900, height: 800 });
    await browser.url('#/light/table/tall-rows');
    await testFn(page);
  });
};

test(
  'row is scrolled to top when focused with keyboard',
  setupTest(async page => {
    // Move focus to the last table header.
    await page.click(headerSelector);
    await page.keys(['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab']);
    await expect(page.getFocusedElementText()).resolves.toBe('State');

    // Scroll the viewport past the first table row.
    await page.windowScrollTo({ top: 200 });

    // Focus the link in the first row.
    await page.keys(['Tab']);

    // Expected the viewport to be scrolled to the top of the first row.
    const windowScroll = await page.getWindowScroll();
    expect(windowScroll.top).toBeLessThan(100);
  })
);

test(
  'row is not scrolled to top when focused with mouse click',
  setupTest(async page => {
    // Scroll the viewport past the first table row.
    await page.windowScrollTo({ top: 200 });

    // Click the link in the first row.
    await page.click(tableWrapper.findBodyCell(1, 1).findLink().toSelector());

    // Expected the viewport scroll to stay unchanged.
    const windowScroll = await page.getWindowScroll();
    expect(windowScroll.top).toBe(200);

    // Expected the link to receive the click.
    await expect(page.getElementsText(headerSelector)).resolves.toEqual(['Table with tall rows, clicks: 1']);
  })
);
