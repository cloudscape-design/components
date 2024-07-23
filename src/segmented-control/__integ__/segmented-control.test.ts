// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const inputWrapper = createWrapper().findInput();
const segmentedControlWrapper = createWrapper().findSegmentedControl();
const selectWrapper = createWrapper().findSelect();

class SegmentedControlPage extends BasePageObject {
  async setMobileViewport() {
    await this.setWindowSize({ width: 300, height: 300 });
  }

  async setNormalViewport() {
    await this.setWindowSize({ width: 1000, height: 1000 });
  }

  isSegmentFocused() {
    return this.isFocused(segmentedControlWrapper.findSelectedSegment().toSelector());
  }

  async clickInput() {
    await this.click(inputWrapper.toSelector());
  }

  async clickSegment(itemIndex: number) {
    await this.click(segmentedControlWrapper.findSegments().get(itemIndex).toSelector());
  }

  async clickOption(itemIndex: number) {
    await this.click(
      selectWrapper
        .findDropdown()
        .findOption(itemIndex + 1)
        .toSelector()
    );
  }

  async openSelect() {
    await this.click(selectWrapper.findTrigger().toSelector());
  }

  countItemsSegmentedControl() {
    return this.getElementsCount(segmentedControlWrapper.findSegments().toSelector());
  }

  countItemsSelect() {
    return this.getElementsCount(selectWrapper.findDropdown().findOptions().toSelector());
  }

  getSelectOption(itemIndex: number) {
    return this.getText(
      selectWrapper
        .findDropdown()
        .findOption(itemIndex + 1)
        .toSelector()
    );
  }

  getSelectedOptionText() {
    return this.getText(selectWrapper.findDropdown().findSelectedOptions().get(1).toSelector());
  }

  getSelectedSegmentText() {
    return this.getText(segmentedControlWrapper.findSelectedSegment().toSelector());
  }

  getSegmentedControlOption(itemIndex: number) {
    return this.getText(
      segmentedControlWrapper
        .findSegments()
        .get(itemIndex + 1)
        .toSelector()
    );
  }
}

const setupTest = (testFn: (page: SegmentedControlPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new SegmentedControlPage(browser);
    await browser.url('#/light/segmented-control/simple');
    await page.waitForVisible(segmentedControlWrapper.toSelector());
    await testFn(page);
  });
};

describe('Keyboard interaction', () => {
  test(
    'Tab press from the component takes it outside to the next control and Tab press from before takes it to the selected segment',
    setupTest(async page => {
      await page.clickSegment(1);
      await page.keys('Tab');
      await expect(page.isSegmentFocused()).resolves.toBe(false);
      await page.clickInput();
      await page.keys('Tab');
      await expect(page.isSegmentFocused()).resolves.toBe(true);
    })
  );
  ['Space', 'Enter'].forEach(confirmKey => {
    test(
      'Keyboard interaction with default selectedId',
      setupTest(async page => {
        await page.clickInput();
        await page.keys(['Tab', 'ArrowLeft']);
        await page.keys(confirmKey);
        await expect(page.getSelectedSegmentText()).resolves.toBe('Segment-3');
      })
    );
    test(
      'Using Tab press and arrow keys interchangeably sets the focus ring correctly',
      setupTest(async page => {
        await page.clickSegment(1);
        await page.clickInput();
        await page.keys(['Tab', 'ArrowRight']);
        await page.keys(confirmKey);
        await expect(page.getSelectedSegmentText()).resolves.toBe('Segment-3');
      })
    );
    test(
      `should go to the next left non-disabled segment on Arrowleft and pressing the ${confirmKey} key`,
      setupTest(async page => {
        await page.clickSegment(1);
        await page.keys('ArrowLeft');
        await page.keys(confirmKey);
        await expect(page.getSelectedSegmentText()).resolves.toBe('Segment-5');
      })
    );
    test(
      `should go to the next right non-disabled segment on ArrowRight and pressing the ${confirmKey} key`,
      setupTest(async page => {
        await page.clickSegment(1);
        await page.keys('ArrowRight');
        await page.keys(confirmKey);
        await expect(page.getSelectedSegmentText()).resolves.toBe('Segment-3');
      })
    );
  });
});

describe('Mobile View: Segmented-Control Renders as Select', () => {
  test(
    `should be the same number of Options on the select as on the segmented control`,
    setupTest(async page => {
      const segmentedControlItems = await page.countItemsSegmentedControl();
      await page.setMobileViewport();
      await page.openSelect();
      await expect(page.countItemsSelect()).resolves.toEqual(segmentedControlItems);
    })
  );
  test(
    `renders the same Option on the select as the one on segmented control`,
    setupTest(async page => {
      const selectedOptionText = await page.getSegmentedControlOption(0);
      await page.setMobileViewport();
      await page.openSelect();
      await expect(page.getSelectOption(0)).resolves.toEqual(selectedOptionText);
    })
  );
  test(
    `renders the same Option on the segmented-control as the one on select`,
    setupTest(async page => {
      await page.setMobileViewport();
      await page.openSelect();
      const selectedOptionText = await page.getSelectOption(3);
      await page.setNormalViewport();
      await page.waitForVisible(segmentedControlWrapper.toSelector());
      await expect(page.getSegmentedControlOption(3)).resolves.toEqual(selectedOptionText);
    })
  );
  test(
    `if you select a different option in Desktop mode it will be selected in Mobile as well`,
    setupTest(async page => {
      await page.clickSegment(1);
      const selectedSegmentText = await page.getSelectedSegmentText();
      await page.setMobileViewport();
      await page.openSelect();
      await expect(page.getSelectedOptionText()).resolves.toEqual(selectedSegmentText);
    })
  );
  test(
    `if you select a different option in Mobile mode it will be selected in Desktop as well`,
    setupTest(async page => {
      await page.setMobileViewport();
      await page.openSelect();
      await page.clickOption(0);
      await page.openSelect();
      const selectedOptionText = await page.getSelectedOptionText();
      await page.setNormalViewport();
      await page.waitForVisible(segmentedControlWrapper.toSelector());
      await expect(page.getSelectedSegmentText()).resolves.toEqual(selectedOptionText);
    })
  );
});
