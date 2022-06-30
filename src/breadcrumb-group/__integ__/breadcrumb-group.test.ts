// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

const breadcrumbGroupWrapper = createWrapper().findBreadcrumbGroup();
const dropdownWrapper = breadcrumbGroupWrapper.findDropdown();
const dropdownSelector = dropdownWrapper.findOpenDropdown().toSelector();
const dropdownTriggerSelector = dropdownWrapper.findNativeButton().toSelector();
const dropdownItemsSelector = dropdownWrapper.findItems().toSelector();

class BreadcrumbGroupPage extends BasePageObject {
  setMobileViewport() {
    return this.setWindowSize({ width: 600, height: 800 });
  }
  isDropdownVisible() {
    return this.isDisplayed(dropdownSelector);
  }
  isDropdownTriggerFocused() {
    return this.isFocused(dropdownTriggerSelector);
  }
  openDropdown() {
    return this.click(dropdownTriggerSelector);
  }
  closeDropdown() {
    return this.keys(['Space']);
  }
  clickItem(index: number) {
    return this.click(dropdownWrapper.findItems().get(index).toSelector());
  }
}
const setupTest = (testFn: (page: BreadcrumbGroupPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BreadcrumbGroupPage(browser);
    await browser.url(`#/light/breadcrumb-group/events`);
    await page.waitForVisible(breadcrumbGroupWrapper.toSelector());
    await testFn(page);
  });
};
describe('BreadcrumbGroup', () => {
  test(
    'Has proper number of items in the dropdown',
    setupTest(async page => {
      await page.setMobileViewport();
      await page.openDropdown();
      expect(await page.getElementsCount(dropdownItemsSelector)).toBe(4);
    })
  );

  test(
    'Dropdown trigger [...] is focused after the dropdown is closed',
    setupTest(async page => {
      await page.setMobileViewport();
      await page.openDropdown();
      await page.closeDropdown();
      const isDropdownVisible = await page.isDropdownVisible();
      expect(isDropdownVisible).toBe(false);
      const isDropdownTriggerFocused = await page.isDropdownTriggerFocused();
      expect(isDropdownTriggerFocused).toBe(true);
    })
  );

  test(
    'follow and click events are fired when a dropdown item is clicked',
    setupTest(async page => {
      await page.setMobileViewport();
      await page.openDropdown();
      await expect(page.getText('#onFollowMessage')).resolves.toEqual('');
      await expect(page.getText('#onClickMessage')).resolves.toEqual('');
      await page.clickItem(1);
      await expect(page.getText('#onFollowMessage')).resolves.toEqual('OnFollow: Second item was selected');
      await expect(page.getText('#onClickMessage')).resolves.toEqual('OnClick: Second item was selected');
    })
  );
});
