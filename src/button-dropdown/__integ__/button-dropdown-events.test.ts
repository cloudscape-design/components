// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import ButtonDropdownPage from '../../__integ__/page-objects/button-dropdown-page';

const setupTest = (itemId: string, testFn: (page: ButtonDropdownPage, itemId: string) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new ButtonDropdownPage('testDropdown', browser);
    await browser.url('#/light/button-dropdown/events');
    await page.waitForVisible(page.getTrigger());
    await expect(page.getDropdownCheckMessage()).resolves.toEqual('');
    await page.openDropdown();
    if (itemId) {
      await page.click(page.findButtonDropdown().findItemById(itemId).toSelector());
    }
    await testFn(page, itemId);
  });
};
describe('clicking on a ButtonDropdown item', () => {
  test(
    'triggers an event of the individual item and changes the content',
    setupTest('individual_enabled_item', async (page, itemId) => {
      await expect(page.getDropdownCheckMessage()).resolves.toEqual(`The action with id ${itemId} has been selected`);
    })
  );
  test(
    'triggers an event of items belonging to a group and changes the content',
    setupTest('c1_enabled_item', async (page, itemId) => {
      await expect(page.getDropdownCheckMessage()).resolves.toEqual(`The action with id ${itemId} has been selected`);
    })
  );
  test(
    'does not trigger an event if the item is disabled',
    setupTest('individual_disabled_item', async page => {
      await expect(page.getDropdownCheckMessage()).resolves.toEqual('');
    })
  );
  test(
    'does not trigger an event if the item belongs to a disabled category',
    setupTest('item_in_disabled_category', async page => {
      await expect(page.getDropdownCheckMessage()).resolves.toEqual('');
    })
  );
  test(
    'allows navigation on item with href - mouse',
    setupTest('', async page => {
      const oldLocation = await page.getLocation();
      await page.click(page.findButtonDropdown().findItemById('plain_href').toSelector());
      await expect(page.getLocation()).resolves.not.toEqual(oldLocation);
    })
  );
  test(
    'allows navigation to be prevented on item with href - mouse',
    setupTest('', async page => {
      const oldLocation = await page.getLocation();
      await page.click(page.findButtonDropdown().findItemById('plain_href_prevented').toSelector());
      await expect(page.getLocation()).resolves.toEqual(oldLocation);
    })
  );
  test(
    'allows navigation on item with href - keyboard',
    setupTest('', async page => {
      const oldLocation = await page.getLocation();
      await page.keys(new Array(11).fill('ArrowDown'));
      await page.keys('Enter');
      await expect(page.getLocation()).resolves.not.toEqual(oldLocation);
    })
  );
  test(
    'allows navigation to be prevented on item with href - keys',
    setupTest('', async page => {
      const oldLocation = await page.getLocation();
      await page.keys(new Array(6).fill('ArrowDown'));
      await page.keys('Enter');
      await expect(page.getLocation()).resolves.toEqual(oldLocation);
    })
  );
});
