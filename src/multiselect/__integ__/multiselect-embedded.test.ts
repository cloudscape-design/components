// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import dropdownFooterStyles from '../../../lib/components/internal/components/dropdown-footer/styles.selectors.js';
import selectableItemsStyles from '../../../lib/components/internal/components/selectable-item/styles.selectors.js';

function setup(testFn: (page: BasePageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await page.setWindowSize({ height: 1000, width: 1000 });
    await browser.url(`/#/light/multiselect/multiselect.async.example?embedded=true&randomErrors=false`);
    await page.waitForVisible('input[placeholder="Find security group"]');
    await testFn(page);
  });
}

test(
  'loads 2 pages of data after rendering and then more pages upon scrolling to list bottom',
  setup(async page => {
    // Wait for artificial test page delays to load a page of items.
    await page.waitForJsTimers(3000);

    await expect(page.getElementsCount(`.${selectableItemsStyles['selectable-item']}`)).resolves.toBe(20);

    // Scroll the list until all pages are loaded.
    for (let count = 30; count <= 50; count += 10) {
      await page.elementScrollTo('ul', { top: 1000, left: 0 });
      await page.waitForJsTimers(1500);
      await expect(page.getElementsCount(`.${selectableItemsStyles['selectable-item']}`)).resolves.toBe(count);
    }

    await expect(page.getText(`.${dropdownFooterStyles.root}`)).resolves.toBe('End of all results');
  })
);
