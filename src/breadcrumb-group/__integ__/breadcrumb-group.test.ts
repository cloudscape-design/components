// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

import breadcrumbGroupStyles from '../../../lib/components/breadcrumb-group/styles.selectors.js';
import tooltipStyles from '../../../lib/components/internal/components/tooltip/styles.selectors.js';

const breadcrumbGroupWrapper = createWrapper().findBreadcrumbGroup();
const dropdownWrapper = breadcrumbGroupWrapper.findDropdown();
const dropdownSelector = dropdownWrapper.findOpenDropdown().toSelector();
const dropdownTriggerSelector = dropdownWrapper.findNativeButton().toSelector();
const dropdownItemsSelector = dropdownWrapper.findItems().toSelector();

class BreadcrumbGroupPage extends BasePageObject {
  setMobileViewport() {
    return this.setWindowSize({ width: 400, height: 800 });
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
  getActiveElementId() {
    return this.browser.execute(function () {
      return document.activeElement?.id;
    });
  }
  isEllipsisVisible() {
    return this.isExisting(`.${breadcrumbGroupStyles.ellipsis}.${breadcrumbGroupStyles.visible}`);
  }
  isTooltipDisplayed() {
    return this.isExisting(`.${tooltipStyles.root}`);
  }
  countTooltips() {
    return this.browser.execute(function (selector) {
      return Array.from(document.querySelectorAll(selector)).length;
    }, `.${tooltipStyles.root}`);
  }
  getTooltipText() {
    return this.getText(`.${tooltipStyles.root}`);
  }
  countElements(selector: string) {
    return this.browser.execute(function (selector) {
      return Array.from(document.querySelectorAll(selector)).length;
    }, selector);
  }
}
const setupTest = (
  testFn: (page: BreadcrumbGroupPage, browser: WebdriverIO.Browser) => Promise<void>,
  sizes?: { width: number; height: number }
) => {
  return useBrowser(async browser => {
    const page = new BreadcrumbGroupPage(browser);
    if (sizes) {
      page.setWindowSize(sizes);
    }
    await browser.url(`#/light/breadcrumb-group/events`);
    await page.waitForVisible(breadcrumbGroupWrapper.toSelector());
    await testFn(page, browser);
  });
};
describe('BreadcrumbGroup', () => {
  test.each([
    [{ width: 770, height: 800 }, 1],
    [{ width: 740, height: 800 }, 2],
    [{ width: 680, height: 800 }, 3],
    [{ width: 610, height: 800 }, 4],
    [{ width: 550, height: 800 }, 6],
  ])('Has proper number of items in the dropdown: %o %d', (sizes, itemsInDropdown) =>
    setupTest(async page => {
      await page.openDropdown();
      expect(await page.getElementsCount(dropdownItemsSelector)).toBe(itemsInDropdown);
    }, sizes)()
  );
  test(
    'Does not return ghost items',
    setupTest(async page => {
      await expect(page.countElements(breadcrumbGroupWrapper.findBreadcrumbLink(1).toSelector())).resolves.toBe(1);
    })
  );
  test(
    'Adjusts display when adding/removing items',
    setupTest(async page => {
      await page.setWindowSize({ width: 950, height: 800 });
      expect(page.isEllipsisVisible()).resolves.toBe(false);
      await page.click('#add');
      expect(page.isEllipsisVisible()).resolves.toBe(true);
      await page.click('#remove');
      expect(page.isEllipsisVisible()).resolves.toBe(false);
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
      await page.clickItem(2);
      await expect(page.getText('#onFollowMessage')).resolves.toEqual('OnFollow: Second item was selected');
      await expect(page.getText('#onClickMessage')).resolves.toEqual('OnClick: Second item was selected');
    })
  );

  describe.each([[true], [false]])('analytics attributes (mobile: %p)', mobile => {
    test(
      'attaches funnel name attribute',
      setupTest(async (page, browser) => {
        if (mobile) {
          await page.setMobileViewport();
        }
        const funnelName = await browser.$('[data-analytics-funnel-key="funnel-name"]').getText();
        expect(funnelName).toBe('Sixth that is very very very very very very long long long text');
      })
    );
    test(
      'attaches resource name attribute',
      setupTest(async (page, browser) => {
        if (mobile) {
          await page.setMobileViewport();
        }
        const funnelName = await browser.$('[data-analytics-funnel-resource-type="true"]').getHTML();
        expect(funnelName).toMatch('>Second<');
      })
    );
  });

  test(
    'Focus does not go into ghost replica',
    setupTest(
      async page => {
        await page.click('#focus-target-long-text');
        await page.keys('Tab');
        await page.keys('Tab');
        await page.keys('Tab');
        await page.keys('Tab');
        await page.keys('Tab');
        await page.keys('Tab');
        await expect(page.getActiveElementId()).resolves.toBe('focus-target-short-text');
      },
      { width: 1200, height: 800 }
    )
  );

  test.each([
    [{ width: 770, height: 800 }, 'when truncated'],
    [{ width: 1200, height: 800 }, 'default state'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ])('Last item should be focusable %s', (viewportSize, scenario) =>
    setupTest(async page => {
      await page.click('#focus-target-long-text');
      await page.keys('Tab');
      await page.keys('Tab');
      await page.keys('Tab');
      await page.keys('Tab');
      await page.keys('Tab');
      await page.keys('Tab');
      await expect(page.isTooltipDisplayed()).resolves.toBe(true);
      await page.keys('Tab');
      await expect(page.isTooltipDisplayed()).resolves.toBe(false);
      await expect(page.getActiveElementId()).resolves.toBe('focus-target-short-text');
    }, viewportSize)()
  );
});
