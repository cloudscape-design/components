// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const segmentedControlWrapper = createWrapper().findSegmentedControl();
const selectWrapper = createWrapper().findSelect();

class SegmentedControlPage extends BasePageObject {
  async setMobileViewport() {
    await this.setWindowSize({ width: 300, height: 300 });
  }
  async selectOption(itemValue: string) {
    await this.click(selectWrapper.findDropdown().findOptionByValue(itemValue).toSelector());
  }
  getSelectText() {
    return this.getText(selectWrapper.findTrigger().toSelector());
  }
}

const setupTest = (testFn: (page: SegmentedControlPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new SegmentedControlPage(browser);
    await browser.url('#/light/segmented-control/edge-case');
    await page.waitForVisible(segmentedControlWrapper.toSelector());
    await testFn(page);
  });
};

describe('SegmentedControl Edge Case', () => {
  test(
    `does not select an option when user clicks on it and 'selectedId' prop was not explicitly updated (has no uncontrolled behavior)`,
    setupTest(async page => {
      await page.setMobileViewport();
      await page.click(selectWrapper.findTrigger().toSelector());
      await page.selectOption('seg-3');
      await expect(page.getSelectText()).resolves.toBe('Segment-5');
    })
  );
});
