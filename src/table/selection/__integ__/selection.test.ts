// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

class SelectionTestPage extends BasePageObject {
  isChecked(selector: string) {
    return this.browser.execute(selector => (document.querySelector(selector) as HTMLInputElement).checked, selector);
  }
}

const setupTest = (selectionType: 'single' | 'multi', testFn: (page: SelectionTestPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new SelectionTestPage(browser);
    await browser.url(`#/light/table-fragments/selection-custom?selectionType=${selectionType}`);
    await page.waitForVisible('table');
    await testFn(page);
  });
};

describe('selection', () => {
  test(
    'selects first item with single selection',
    setupTest('single', async page => {
      await page.click('[data-testid="selection-type"]');
      await page.keys(['Tab', 'Space']);
      await expect(page.isChecked('tr[data-rowindex="1"] input')).resolves.toBe(true);
      await expect(page.isChecked('tr[data-rowindex="2"] input')).resolves.toBe(false);
    })
  );

  test(
    'selects second item with single selection',
    setupTest('single', async page => {
      await page.click('[data-testid="selection-type"]');
      await page.keys(['Tab', 'ArrowDown']);
      await expect(page.isChecked('tr[data-rowindex="1"] input')).resolves.toBe(false);
      await expect(page.isChecked('tr[data-rowindex="2"] input')).resolves.toBe(true);
    })
  );

  test(
    'selects first two items with multi selection',
    setupTest('multi', async page => {
      await page.click('[data-testid="selection-type"]');
      await page.keys(['Tab', 'ArrowDown', 'Space']);
      await page.keys(['ArrowDown', 'Space']);
      await expect(page.isChecked('tr[data-rowindex="1"] input')).resolves.toBe(true);
      await expect(page.isChecked('tr[data-rowindex="2"] input')).resolves.toBe(true);
      await expect(page.isChecked('tr[data-rowindex="3"] input')).resolves.toBe(false);
    })
  );

  test(
    'selects all items but first with multi selection',
    setupTest('multi', async page => {
      await page.click('[data-testid="selection-type"]');
      await page.keys(['Tab', 'Space']);
      await page.keys(['ArrowDown', 'Space']);
      await expect(page.isChecked('tr[data-rowindex="1"] input')).resolves.toBe(false);
      await expect(page.isChecked('tr[data-rowindex="2"] input')).resolves.toBe(true);
      await expect(page.isChecked('tr[data-rowindex="3"] input')).resolves.toBe(true);
    })
  );
});
