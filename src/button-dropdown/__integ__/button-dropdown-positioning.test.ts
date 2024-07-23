// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import ButtonDropdownPage from '../../__integ__/page-objects/button-dropdown-page';

const setupTest = (id: string, testFn: (page: ButtonDropdownPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new ButtonDropdownPage(id, browser);
    await browser.url('#/light/button-dropdown/expandable');
    await page.waitForVisible(page.getTrigger());
    await testFn(page);
  });
};
describe('clicking on the ButtonDropdown', () => {
  test(
    'opens downwards when there is more space below',
    setupTest('topLeftDropdown', async page => {
      await page.openDropdown();
      await expect(page.isDropdownOpen()).resolves.toBe(true);
      const { bottom: triggerBottom } = await page.getBoundingBox(page.getTrigger());
      const { bottom: dropdownBottom } = await page.getBoundingBox(page.getOpenDropdown());

      expect(dropdownBottom).toBeGreaterThan(triggerBottom);
    })
  );
  test(
    'opens upwards when there is more space above',
    setupTest('bottomLeftDropdown', async page => {
      await page.openDropdown();
      await expect(page.isDropdownOpen()).resolves.toBe(true);
      const { bottom: triggerBottom } = await page.getBoundingBox(page.getTrigger());
      const { bottom: dropdownBottom } = await page.getBoundingBox(page.getOpenDropdown());

      expect(dropdownBottom).toBeLessThan(triggerBottom);
    })
  );
});
