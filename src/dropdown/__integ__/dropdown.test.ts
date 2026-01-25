// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import { DropdownPageObject } from './dropdown-page-object';

function setupTest(url: string, dropdownId: string, testFn: (page: DropdownPageObject) => Promise<void>) {
  return useBrowser(async browser => {
    await browser.url(url);
    const page = new DropdownPageObject(dropdownId, browser);
    await page.waitForVisible(page.getDropdown());
    await page.click(page.getTrigger());
    await testFn(page);
  });
}

describe('Dropdown', () => {
  test(
    'dropdown opens down, if there is enough space below it',
    setupTest('#/light/dropdown/simple', 'smallDropDown', async page => {
      const { top: dropdownTop } = await page.getBoundingBox(page.getOpenDropdown());
      const { top: triggerTop } = await page.getBoundingBox(page.getTrigger());
      expect(dropdownTop).toBeGreaterThan(triggerTop);
    })
  );
  test(
    'dropdown opens down, if there is more space below than above',
    setupTest('#/light/dropdown/simple', 'largeDropDown', async page => {
      await expect(page.getDropdownVerticalDirection()).resolves.toEqual('down');
    })
  );
  test(
    'dropdown opens up, if there is more space above than below',
    setupTest('#/light/dropdown/simple', 'largeDropUp', async page => {
      const { top: dropdownTop } = await page.getBoundingBox(page.getOpenDropdown());
      expect(dropdownTop).toBeGreaterThan(0);
      await expect(page.getDropdownVerticalDirection()).resolves.toEqual('up');
    })
  );
  test(
    'dropdown opens to the right, if there is enough space on the right side',
    setupTest('#/light/dropdown/positioning', 'topLeftDropDown', async page => {
      const { left: dropdownLeft, right: dropdownRight } = await page.getBoundingBox(page.getOpenDropdown());
      const { left: triggerLeft, right: triggerRight } = await page.getBoundingBox(page.getTrigger());
      expect(dropdownRight).toBeGreaterThan(triggerRight);
      expect(dropdownLeft).toEqual(triggerLeft);
    })
  );
  test(
    'dropdown width is equal trigger width, if dropdown content is narrower than trigger',
    setupTest('#/light/dropdown/positioning', 'bottomLeftDropDown', async page => {
      const { width: dropdownWidth } = await page.getBoundingBox(page.getOpenDropdown());
      const { width: triggerWidth } = await page.getBoundingBox(page.getTrigger());
      expect(dropdownWidth).toEqual(triggerWidth);
    })
  );
  test(
    'dropdown opens down in a container with fixed position',
    setupTest('#/light/dropdown/fixed-container', 'fixedDropdown', async page => {
      const { height: windowHeight, pageHeight } = await page.getViewportSize();
      await expect(page.getDropdownVerticalDirection()).resolves.toEqual('down');
      await page.click(page.getTrigger()); // close already open dropdown
      await page.windowScrollTo({ top: windowHeight });
      await page.click(page.getTrigger());
      await expect(page.getDropdownVerticalDirection()).resolves.toEqual('down');
      await page.click(page.getTrigger());
      await page.windowScrollTo({ top: pageHeight });
      await page.click(page.getTrigger());
      await expect(page.getDropdownVerticalDirection()).resolves.toEqual('down');
    })
  );
  describe('minWidth property', () => {
    const MIN_WIDTH = 800;
    test(
      'is used as a minimum width of the dropdown instead of the trigger width',
      setupTest('#/light/dropdown/min-width', 'minWidthDropdown', async page => {
        const { width: dropdownWidth } = await page.getBoundingBox(page.getOpenDropdown());
        expect(dropdownWidth).toEqual(MIN_WIDTH);
      })
    );
    test(
      'does nothing, if trigger width is smaller than the provided minWidth',
      setupTest('#/light/dropdown/min-width', 'minWidthDropdown', async page => {
        await page.setWindowSize({ width: 600, height: 600 });
        // reopen the dropdown after the window got resized
        await page.click(page.getTrigger());
        await page.click(page.getTrigger());
        const { width: dropdownWidth } = await page.getBoundingBox(page.getOpenDropdown());
        const { width: triggerWidth } = await page.getBoundingBox(page.getTrigger());
        expect(dropdownWidth).toBeLessThan(MIN_WIDTH);
        expect(dropdownWidth).toBeLessThanOrEqual(triggerWidth);
      })
    );
  });
  test(
    'dropdown opens to the left, if there is not enough space on the right side and enough on the left',
    setupTest('#/light/dropdown/positioning', 'topRightDropDown', async page => {
      const { left: dropdownLeft, right: dropdownRight } = await page.getBoundingBox(page.getOpenDropdown());
      const { left: triggerLeft, right: triggerRight } = await page.getBoundingBox(page.getTrigger());
      expect(dropdownLeft).toBeLessThan(triggerLeft);
      expect(dropdownRight).toEqual(triggerRight);
    })
  );
  test(
    'dropdown opens to the right, if there is not enough space on both sides, but more space on the right',
    setupTest('#/light/dropdown/positioning', 'topMiddleDropDown', async page => {
      const { left: dropdownLeft, right: dropdownRight } = await page.getBoundingBox(page.getOpenDropdown());
      const { left: triggerLeft, right: triggerRight } = await page.getBoundingBox(page.getTrigger());
      expect(dropdownLeft).toEqual(triggerLeft);
      expect(dropdownRight).toBeGreaterThan(triggerRight);
    })
  );
  test(
    'dropdown opens to the left, if there is not enough space on both sides, but more space on the left',
    setupTest('#/light/dropdown/positioning', 'bottomRightDropDown', async page => {
      const { left: dropdownLeft, right: dropdownRight } = await page.getBoundingBox(page.getOpenDropdown());
      const { left: triggerLeft, right: triggerRight } = await page.getBoundingBox(page.getTrigger());
      expect(dropdownRight).toEqual(triggerRight);
      expect(dropdownLeft).toBeLessThan(triggerLeft);
    })
  );
  it(
    'stretch height: vertically stretch to fit the content and overflow to the bottom and not to the right',
    setupTest('#/light/dropdown/interior-stretch-height', 'dropdown1', async page => {
      const { bottom: containerBottom, right: containerRight } = await page.getBoundingBox('#container-1');
      const { bottom: dropdownBottom, right: dropdownRight } = await page.getBoundingBox(page.getOpenDropdown());
      expect(dropdownRight).toBeLessThan(containerRight);
      expect(dropdownBottom).toBeGreaterThan(containerBottom);
    })
  );
  it(
    'do not stretch height: content does not fit vertically, dropdown adds scrollbar and do not overlap',
    setupTest('#/light/dropdown/interior-stretch-height', 'dropdown2', async page => {
      const { bottom: containerBottom, right: containerRight } = await page.getBoundingBox('#container-2');
      const { bottom: dropdownBottom, right: dropdownRight } = await page.getBoundingBox(page.getOpenDropdown());
      expect(dropdownRight).toBeLessThan(containerRight);
      expect(dropdownBottom).toBeLessThan(containerBottom);
    })
  );
  test(
    'dropdown reserves 50px space on right side',
    setupTest('#/light/dropdown/interior-stretch-height', 'dropdown2', async page => {
      const { right: containerRight } = await page.getBoundingBox('#container-2');
      const { right: dropdownRight } = await page.getBoundingBox(page.getOpenDropdown());
      expect(containerRight - dropdownRight).toEqual(50);
    })
  );
  test(
    'dropdown reserves 20px on right side on small screen',
    setupTest('#/light/dropdown/interior-stretch-height', 'dropdown2', async page => {
      await page.setWindowSize({ width: 500, height: 800 });
      const { right: containerRight } = await page.getBoundingBox('#container-2');
      const { right: dropdownRight } = await page.getBoundingBox(page.getOpenDropdown());
      expect(containerRight - dropdownRight).toEqual(20);
    })
  );
  test(
    'dropdown reserves 31px less at bottom on small screen',
    setupTest('#/light/dropdown/interior-stretch-height', 'dropdown2', async page => {
      const { bottom: containerBottom } = await page.getBoundingBox('#container-2');
      const { bottom: dropdownBottom } = await page.getBoundingBox(page.getOpenDropdown());
      const bottomPadding = containerBottom - dropdownBottom;
      await page.setWindowSize({ width: 500, height: 800 });
      const { bottom: containerBottomSmallScreen } = await page.getBoundingBox('#container-2');
      const { bottom: dropdownBottomSmallScreen } = await page.getBoundingBox(page.getOpenDropdown());
      const bottomPaddingSmallScreen = containerBottomSmallScreen - dropdownBottomSmallScreen;
      expect(bottomPadding - bottomPaddingSmallScreen).toEqual(31);
    })
  );
  it(
    'stretch height and width: content does not fit vertically and horizontally, overflow to the bottom and to the right',
    setupTest('#/light/dropdown/interior-stretch-height', 'dropdown3', async page => {
      const { bottom: containerBottom, right: containerRight } = await page.getBoundingBox('#container-3');
      const { bottom: dropdownBottom, right: dropdownRight } = await page.getBoundingBox(page.getOpenDropdown());
      expect(dropdownRight).toBeGreaterThan(containerRight);
      expect(dropdownBottom).toBeGreaterThan(containerBottom);
    })
  );

  describe('with preferred center position', () => {
    it(
      'is centered when there is enough space',
      setupTest('#/light/dropdown/prefer-center', 'centerDropdown', async page => {
        const { left: dropdownLeft, right: dropdownRight } = await page.getBoundingBox(page.getOpenDropdown());
        const { left: triggerLeft, right: triggerRight } = await page.getBoundingBox(page.getTrigger());

        expect(dropdownLeft).toBeLessThan(triggerLeft);
        expect(dropdownRight).toBeGreaterThan(triggerRight);
      })
    );

    it(
      'drops to the left if it cannot be centered and there is more space to the left',
      setupTest('#/light/dropdown/prefer-center', 'rightDropdown', async page => {
        const { left: dropdownLeft, right: dropdownRight } = await page.getBoundingBox(page.getOpenDropdown());
        const { left: triggerLeft, right: triggerRight } = await page.getBoundingBox(page.getTrigger());

        expect(dropdownRight).toEqual(triggerRight);
        expect(dropdownLeft).toBeLessThan(triggerLeft);
      })
    );

    it(
      'drops to the right if it cannot be centered and there is more space to the right',
      setupTest('#/light/dropdown/prefer-center', 'leftDropdown', async page => {
        const { left: dropdownLeft, right: dropdownRight } = await page.getBoundingBox(page.getOpenDropdown());
        const { left: triggerLeft, right: triggerRight } = await page.getBoundingBox(page.getTrigger());

        expect(dropdownLeft).toEqual(triggerLeft);
        expect(dropdownRight).toBeGreaterThan(triggerRight);
      })
    );
  });
});
