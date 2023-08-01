// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

test(
  'cell remains focused when row re-renders',
  useBrowser({ width: 1800, height: 800 }, async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/table-fragments/grid-navigation-custom');
    await page.waitForVisible('table');

    await page.click('button[aria-label="Update item"]');
    await expect(page.isFocused('tr[aria-rowindex="2"]>td[aria-colindex="2"]')).resolves.toBe(true);
  })
);

test(
  'cell focus stays in the same position when row gets removed',
  useBrowser({ width: 1800, height: 800 }, async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/table-fragments/grid-navigation-custom');
    await page.waitForVisible('table');

    await page.click('button[aria-label="Delete item"]');
    await expect(page.isFocused('tr[aria-rowindex="2"]>td[aria-colindex="2"]')).resolves.toBe(true);
  })
);

test(
  'last grid cell remains focusable after new items are added',
  useBrowser({ width: 1800, height: 800 }, async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/table-fragments/grid-navigation-custom');
    await page.waitForVisible('table');

    const initialLastElementSelector = 'tr[aria-rowindex="26"] > td[aria-colindex="9"]';

    await expect(page.getElementAttribute(initialLastElementSelector, 'tabIndex')).resolves.toBe('0');

    await page.click('button[aria-label="Duplicate item"]');
    const newLastElementSelector = 'tr[aria-rowindex="27"] > td[aria-colindex="9"]';

    await expect(page.getElementAttribute(initialLastElementSelector, 'tabIndex')).resolves.toBe('-1');
    await expect(page.getElementAttribute(newLastElementSelector, 'tabIndex')).resolves.toBe('0');
  })
);
