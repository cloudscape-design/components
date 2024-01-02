// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../../lib/components/test-utils/selectors';
import { GridNavigationPageObject } from './page-object';

interface Options {
  actionsMode?: 'dropdown' | 'inline';
}

const setupTest = (
  { actionsMode = 'dropdown' }: Options,
  testFn: (page: GridNavigationPageObject) => Promise<void>
) => {
  return useBrowser(async browser => {
    const page = new GridNavigationPageObject(browser);
    const query = new URLSearchParams({ actionsMode });
    await browser.url(`#/light/table-fragments/grid-navigation-custom/?${query.toString()}`);
    await page.waitForVisible('table');
    await testFn(page);
  });
};

test(
  'cell action remains focused when row re-renders',
  setupTest({ actionsMode: 'inline' }, async page => {
    await page.click('button[aria-label="Update item"]');
    await expect(page.isFocused('button[aria-label="Update item"]')).resolves.toBe(true);
  })
);

test(
  'cell focus stays in the same position when row gets removed',
  setupTest({ actionsMode: 'inline' }, async page => {
    await page.click('button[aria-label="Delete item"]');
    await expect(page.isFocused('button[aria-label="Delete item"]')).resolves.toBe(true);
  })
);

test(
  'cell focus stays in the same position when row gets removed with auto-refresh',
  setupTest({}, async page => {
    const firstButtonDropdown = createWrapper().findButtonDropdown();
    await page.click(firstButtonDropdown.toSelector());
    await page.click(firstButtonDropdown.findHighlightedItem().toSelector());
    await expect(page.isFocused(firstButtonDropdown.findNativeButton().toSelector())).resolves.toBe(true);

    await page.refreshItems();
    await expect(page.isFocused(firstButtonDropdown.findNativeButton().toSelector())).resolves.toBe(true);
  })
);

test(
  'keeps last focused cell position when row gets removed from outside table',
  setupTest({}, async page => {
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
  setupTest({}, async page => {
    await page.click('[aria-label="Edit DNS name"]');
    await page.click('button[aria-label="Save"]');
    await expect(page.isFocused('[aria-label="Edit DNS name"]')).resolves.toBe(true);
  })
);

test(
  'table has a single tab stop',
  setupTest({}, async page => {
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
