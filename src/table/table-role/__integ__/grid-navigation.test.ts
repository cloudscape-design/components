// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

test(
  'cell action remains focused when row re-renders',
  useBrowser({ width: 1800, height: 800 }, async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/table-fragments/grid-navigation-custom');
    await page.waitForVisible('table');

    await page.click('button[aria-label="Update item"]');
    await expect(page.isFocused('tr[aria-rowindex="2"] > td[aria-colindex="2"]')).resolves.toBe(true);
  })
);

test(
  'cell focus stays in the same position when row gets removed',
  useBrowser({ width: 1800, height: 800 }, async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/table-fragments/grid-navigation-custom');
    await page.waitForVisible('table');

    await page.click('button[aria-label="Delete item"]');
    await expect(page.isFocused('tr[aria-rowindex="2"] > td[aria-colindex="2"]')).resolves.toBe(true);
  })
);

test(
  'table has a single tab stop',
  useBrowser({ width: 1800, height: 800 }, async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/table-fragments/grid-navigation-custom');
    await page.waitForVisible('table');

    await page.click('[data-testid="link-before"]');
    await page.keys('Tab');
    await expect(page.isFocused('tr[aria-rowindex="1"] > th[aria-colindex="1"]')).resolves.toBe(true);

    await page.keys('Tab');
    await expect(page.isFocused('[data-testid="link-after"]')).resolves.toBe(true);

    await page.keys(['Shift', 'Tab', 'Null']);
    await expect(page.isFocused('tr[aria-rowindex="1"] > th[aria-colindex="1"]')).resolves.toBe(true);

    await page.keys(['ArrowRight', 'ArrowDown', 'Enter', 'ArrowRight']);
    await expect(page.isFocused('tr[aria-rowindex="2"] [aria-label="Duplicate item"]')).resolves.toBe(true);

    await page.keys('Tab');
    await expect(page.isFocused('[data-testid="link-after"]')).resolves.toBe(true);

    await page.keys(['Shift', 'Tab', 'Null']);
    await expect(page.isFocused('tr[aria-rowindex="2"]')).resolves.toBe(true);

    await page.keys(['Shift', 'Tab', 'Null']);
    await expect(page.isFocused('[data-testid="link-before"]')).resolves.toBe(true);
  })
);
