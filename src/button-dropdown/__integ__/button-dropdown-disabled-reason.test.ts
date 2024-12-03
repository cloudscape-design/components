// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject, ElementRect } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();

class ButtonDropdownDisabledReasonPage extends BasePageObject {
  findButtonDropdown() {
    return wrapper.findButtonDropdown('[data-testid="buttonDropdown"]');
  }
  findDisabledReason() {
    return this.findButtonDropdown().findDisabledReason();
  }
  toggleAlignment() {
    return this.click('[data-testid=alignment]');
  }
  openDropdown() {
    return this.click(this.findButtonDropdown().findNativeButton().toSelector());
  }
  getDisabledReason() {
    return this.getText(this.findButtonDropdown().findDisabledReason().toSelector());
  }
  setMobileWindow() {
    return this.setWindowSize({ width: 400, height: 600 });
  }
  async overlapsDropdown() {
    const dropdownRect = await this.getBoundingBox(this.findButtonDropdown().findOpenDropdown().toSelector());
    const tooltipRect = await this.getBoundingBox(this.findDisabledReason().toSelector());
    return overlaps(dropdownRect, tooltipRect);
  }
}

const setupTest = (testFn: (page: ButtonDropdownDisabledReasonPage) => Promise<void>, isMobile?: boolean) => {
  return useBrowser(async browser => {
    const page = new ButtonDropdownDisabledReasonPage(browser);
    if (isMobile) {
      await page.setMobileWindow();
    }

    await browser.url('#/light/button-dropdown/disabled-reason?visualRefresh=false');
    await page.waitForVisible(page.findButtonDropdown().toSelector());
    await page.openDropdown();
    await testFn(page);
  });
};

describe('Button Dropdown - Disabled Reason', () => {
  it(
    'closes on escape',
    setupTest(async page => {
      await page.hoverElement(page.findButtonDropdown().findItemById('connect').toSelector());
      await page.waitForVisible(page.findDisabledReason().toSelector());
      expect(await page.getDisabledReason()).toEqual('Instance must be running.');
      await page.keys('Escape');
      await page.waitForAssertion(async () =>
        expect(await page.isDisplayed(page.findDisabledReason().toSelector())).toBeFalsy()
      );
    })
  );

  it(
    'opens and closes on mouse hover',
    setupTest(async page => {
      await page.hoverElement(page.findButtonDropdown().findItemById('connect').toSelector());
      await page.waitForVisible(page.findDisabledReason().toSelector());
      expect(await page.getDisabledReason()).toEqual('Instance must be running.');
      await page.hoverElement(page.findButtonDropdown().findItemById('manage-state').toSelector());
      await page.waitForVisible(page.findDisabledReason().toSelector());
      expect(await page.getDisabledReason()).toContain('Instance state must not be pending or stopping.');
      await page.hoverElement(page.findButtonDropdown().findExpandableCategoryById('settings').toSelector());
      await page.waitForAssertion(async () =>
        expect(await page.isDisplayed(page.findDisabledReason().toSelector())).toBeFalsy()
      );
    })
  );

  [true, false].forEach(mobile => {
    it(
      `opens and closes on click when mobile=${mobile}`,
      setupTest(async page => {
        await page.click(page.findButtonDropdown().findItemById('manage-state').toSelector());
        await page.waitForVisible(page.findDisabledReason().toSelector());
        expect(await page.getDisabledReason()).toContain('Instance state must not be pending or stopping.');
        await page.click(page.findButtonDropdown().findItemById('connect').toSelector());
        await page.waitForVisible(page.findDisabledReason().toSelector());
        expect(await page.getDisabledReason()).toEqual('Instance must be running.');
        await page.hoverElement(page.findButtonDropdown().findExpandableCategoryById('settings').toSelector());
        await page.waitForAssertion(async () =>
          expect(await page.isDisplayed(page.findDisabledReason().toSelector())).toBeFalsy()
        );
      }, mobile)
    );
  });
  it(
    'opens and closes on keyboard focus',
    setupTest(async page => {
      await page.waitForVisible(page.findDisabledReason().toSelector());
      expect(await page.getDisabledReason()).toContain('Instance must be running.');
      await page.keys('ArrowDown');
      await page.waitForVisible(page.findDisabledReason().toSelector());
      expect(await page.getDisabledReason()).toContain('A single instance needs to be selected.');
      await page.keys(['ArrowDown', 'ArrowDown']);
      await page.waitForAssertion(async () =>
        expect(await page.isDisplayed(page.findDisabledReason().toSelector())).toBeFalsy()
      );
    })
  );
  it(
    'opens and closes for expandable category elements',
    setupTest(async page => {
      await page.hoverElement(page.findButtonDropdown().findExpandableCategoryById('classic-link').toSelector());
      await page.waitForVisible(page.findDisabledReason().toSelector());
      expect(await page.getDisabledReason()).toContain('Requires a classic-enabled accounts.');
      await page.keys('ArrowDown');
      await page.waitForAssertion(async () =>
        expect(await page.isDisplayed(page.findDisabledReason().toSelector())).toBeFalsy()
      );
    })
  );
  it(
    'opens and closes on nested elements',
    setupTest(async page => {
      await page.click(page.findButtonDropdown().findExpandableCategoryById('settings').toSelector());
      await page.waitForVisible(page.findDisabledReason().toSelector());
      expect(await page.getDisabledReason()).toEqual(
        'Instance must be running and not already be attached to an Auto Scaling Group.'
      );
      await page.hoverElement(page.findButtonDropdown().findItemById('termination-protection').toSelector());
      await page.waitForAssertion(async () =>
        expect(await page.isDisplayed(page.findDisabledReason().toSelector())).toBeFalsy()
      );
    })
  );
  [true, false].forEach(rightAligned => {
    it(
      `avoids overlap with dropdown with rightAligned=${rightAligned}`,
      setupTest(async page => {
        if (rightAligned) {
          // click body to close button dropdown
          await page.click('body');
          await page.toggleAlignment();
          await page.openDropdown();
        }
        await page.hoverElement(page.findButtonDropdown().findItemById('connect').toSelector());
        await page.waitForVisible(page.findDisabledReason().toSelector());
        expect(await page.overlapsDropdown()).toBeFalsy();
        await page.click(page.findButtonDropdown().findExpandableCategoryById('settings').toSelector());
        await page.waitForVisible(page.findDisabledReason().toSelector());
        expect(await page.overlapsDropdown()).toBeFalsy();
      })
    );
  });
});

const overlaps = (one: ElementRect, two: ElementRect) => {
  if (one.right < two.left || one.left > two.right) {
    return false;
  }

  if (one.bottom < two.top || one.top > two.bottom) {
    return false;
  }

  return true;
};
