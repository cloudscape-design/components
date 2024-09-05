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
  getActiveElemenId() {
    return this.browser.execute(function () {
      return document.activeElement!.id;
    });
  }
  isEllipsisVisible() {
    return this.isExisting(`.${breadcrumbGroupStyles.ellipsis}.${breadcrumbGroupStyles.visible}`);
  }
  isTooltipDisplayed() {
    return this.isExisting(createWrapper().find(`.${tooltipStyles.root}`).toSelector());
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
  test(
    'Has proper number of items in the dropdown',
    setupTest(async page => {
      await page.setWindowSize({ width: 645, height: 800 });
      await page.openDropdown();
      expect(await page.getElementsCount(dropdownItemsSelector)).toBe(1);
      await page.closeDropdown();

      await page.setWindowSize({ width: 570, height: 800 });
      await page.openDropdown();
      expect(await page.getElementsCount(dropdownItemsSelector)).toBe(2);
      await page.closeDropdown();

      await page.setWindowSize({ width: 500, height: 800 });
      await page.openDropdown();
      expect(await page.getElementsCount(dropdownItemsSelector)).toBe(3);
      await page.closeDropdown();

      await page.setWindowSize({ width: 400, height: 800 });
      await page.openDropdown();
      expect(await page.getElementsCount(dropdownItemsSelector)).toBe(4);
    })
  );
  test(
    'Adjusts display when adding/removing items',
    setupTest(async page => {
      await page.setWindowSize({ width: 700, height: 800 });
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
      await page.clickItem(1);
      await expect(page.getText('#onFollowMessage')).resolves.toEqual('OnFollow: Second item was selected');
      await expect(page.getText('#onClickMessage')).resolves.toEqual('OnClick: Second item was selected');
    })
  );

  describe('Item popover', () => {
    test(
      'should be displayed for truncated items on first render',
      setupTest(
        async page => {
          await page.click('#focus-target-long-text');
          await page.keys('Tab');
          await expect(page.isTooltipDisplayed()).resolves.toBe(true);
          await page.keys('Tab');
          await expect(page.isTooltipDisplayed()).resolves.toBe(false);
        },
        { width: 100, height: 800 }
      )
    );

    test(
      'should not be displayed for non-truncated items on first render',
      setupTest(
        async page => {
          await page.click('#focus-target-long-text');
          await page.keys('Tab');
          await expect(page.isTooltipDisplayed()).resolves.toBe(false);
        },
        { width: 1200, height: 800 }
      )
    );

    test(
      'should be displayed for truncated items after resizing',
      setupTest(
        async page => {
          await page.setWindowSize({ width: 1000, height: 800 });
          await page.click('#focus-target-long-text');
          await page.keys('Tab');
          await expect(page.isTooltipDisplayed()).resolves.toBe(true);
          await page.keys('Tab');
          await expect(page.isTooltipDisplayed()).resolves.toBe(false);
        },
        { width: 1200, height: 800 }
      )
    );
    test(
      'should be displayed for truncated items after collapsing items into dropdown',
      setupTest(
        async page => {
          await page.setMobileViewport();
          await page.click('#focus-target-long-text');
          await page.keys('Tab');
          await expect(page.isTooltipDisplayed()).resolves.toBe(true);
        },
        { width: 1200, height: 800 }
      )
    );
    test(
      'should not be displayed after making the viewport larger again',
      setupTest(
        async page => {
          await page.setMobileViewport();
          await page.setWindowSize({ width: 1200, height: 800 });
          await page.click('#focus-target-long-text');
          await page.keys('Tab');
          await expect(page.isTooltipDisplayed()).resolves.toBe(false);
          await page.keys('Tab');
          await expect(page.isTooltipDisplayed()).resolves.toBe(false);
          await page.keys('Tab');
        },
        { width: 1200, height: 800 }
      )
    );

    test(
      'Item popover should close after pressing Escape',
      setupTest(async page => {
        await page.setMobileViewport();
        await page.click('#focus-target-long-text');
        await page.keys('Tab');
        await expect(page.isTooltipDisplayed()).resolves.toBe(true);
        await page.keys('Escape');
        await expect(page.isTooltipDisplayed()).resolves.toBe(false);
      })
    );
  });

  test(
    'Attaches funnel name attribute to last breadcrumb item',
    setupTest(async (page, browser) => {
      await page.setMobileViewport();
      const funnelName = await browser.$('[data-analytics-funnel-key="funnel-name"]').getText();
      expect(funnelName).toBe('Sixth that is very very very very very very long long long text');
    })
  );

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
        await expect(page.getActiveElemenId()).resolves.toBe('focus-target-short-text');
      },
      { width: 1200, height: 800 }
    )
  );

  test(
    'Last item is focusable when truncated',
    setupTest(async page => {
      await page.setMobileViewport();
      await page.click('#focus-target-long-text');
      await page.keys('Tab');
      await page.keys('Tab');
      await page.keys('Tab');
      await expect(page.isTooltipDisplayed()).resolves.toBe(true);
      await page.keys('Tab');
      await expect(page.isTooltipDisplayed()).resolves.toBe(false);
      await expect(page.getActiveElemenId()).resolves.toBe('focus-target-short-text');
    })
  );
});
