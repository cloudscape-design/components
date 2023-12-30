// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../../lib/components/test-utils/selectors';

interface ExtendedWindow extends Window {
  refreshItems: () => void;
}
declare const window: ExtendedWindow;

test(
  'cell action remains focused when row re-renders',
  useBrowser({}, async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/table-fragments/grid-navigation-custom/?actionsMode=inline');
    await page.waitForVisible('table');

    await page.click('button[aria-label="Update item"]');
    await expect(page.isFocused('button[aria-label="Update item"]')).resolves.toBe(true);
  })
);

test(
  'cell focus stays in the same position when row gets removed',
  useBrowser({}, async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/table-fragments/grid-navigation-custom/?actionsMode=inline');
    await page.waitForVisible('table');

    await page.click('button[aria-label="Delete item"]');
    await expect(page.isFocused('button[aria-label="Delete item"]')).resolves.toBe(true);
  })
);

test(
  'cell focus stays in the same position when row gets removed with auto-refresh',
  useBrowser({}, async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/table-fragments/grid-navigation-custom');
    await page.waitForVisible('table');

    const firstButtonDropdown = createWrapper().findButtonDropdown();
    await page.click(firstButtonDropdown.toSelector());
    await page.click(firstButtonDropdown.findHighlightedItem().toSelector());
    await expect(page.isFocused(firstButtonDropdown.findNativeButton().toSelector())).resolves.toBe(true);

    await browser.execute(() => window.refreshItems());
    await expect(page.isFocused(firstButtonDropdown.findNativeButton().toSelector())).resolves.toBe(true);
  })
);

test(
  'keeps last focused cell position when row gets removed from outside table',
  useBrowser({}, async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/table-fragments/grid-navigation-custom');
    await page.waitForVisible('table');

    const firstButtonDropdown = createWrapper().findButtonDropdown();
    await page.click(firstButtonDropdown.toSelector());
    await page.click('button[aria-label="Refresh"]');
    await expect(page.isFocused('button[aria-label="Refresh"]')).resolves.toBe(true);

    await page.keys(['Tab', 'Tab']);
    await expect(page.isFocused(firstButtonDropdown.findNativeButton().toSelector())).resolves.toBe(true);
  })
);

test(
  'retains cell focus when existing inline edit',
  useBrowser({}, async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/table-fragments/grid-navigation-custom');
    await page.waitForVisible('table');

    await page.click('[aria-label="Edit DNS name"]');
    await page.click('button[aria-label="Save"]');
    await expect(page.isFocused('[aria-label="Edit DNS name"]')).resolves.toBe(true);
  })
);

test(
  'table has a single tab stop',
  useBrowser({}, async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/table-fragments/grid-navigation-custom');
    await page.waitForVisible('table');

    await page.click('[data-testid="link-before"]');
    await page.keys('Tab');
    await expect(page.isFocused('tr[aria-rowindex="1"] > th[aria-colindex="1"] button')).resolves.toBe(true);

    await page.keys('Tab');
    await expect(page.isFocused('[data-testid="link-after"]')).resolves.toBe(true);

    await page.keys(['Shift', 'Tab', 'Null']);
    await expect(page.isFocused('tr[aria-rowindex="1"] > th[aria-colindex="1"] button')).resolves.toBe(true);

    await page.keys(['ArrowRight', 'ArrowDown']);
    await expect(page.isFocused('tr[aria-rowindex="2"] [aria-label="Item actions"]')).resolves.toBe(true);

    await page.keys('Tab');
    await expect(page.isFocused('[data-testid="link-after"]')).resolves.toBe(true);

    await page.keys(['Shift', 'Tab', 'Null']);
    await expect(page.isFocused('tr[aria-rowindex="2"] [aria-label="Item actions"]')).resolves.toBe(true);

    await page.keys(['Shift', 'Tab', 'Null']);
    await expect(page.isFocused('[data-testid="link-before"]')).resolves.toBe(true);
  })
);
