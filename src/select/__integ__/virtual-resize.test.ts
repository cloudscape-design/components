// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import SelectPage from './page-objects/select-page';

interface ExtendedWindow extends Window {
  __shrinkComponent?: (shrunk: boolean) => void;
}
declare const window: ExtendedWindow;

class ResizeSelectPage extends SelectPage {
  async shrinkSelect(shrunk: boolean) {
    await this.browser.execute(shrunk => window.__shrinkComponent && window.__shrinkComponent(shrunk), shrunk);
  }
  async getOptionBox(index: number) {
    const optionSelector = this.wrapper.findDropdown().findOption(index).toSelector();
    const boundingBox = await this.getBoundingBox(optionSelector);
    return boundingBox;
  }
}

function setupTest(testFn: (page: ResizeSelectPage) => Promise<void>) {
  return useBrowser(async browser => {
    const wrapper = createWrapper().findSelect();
    const page = new ResizeSelectPage(browser, wrapper);
    await browser.url('/#/light/select/virtual-resize');
    await testFn(page);
  });
}

describe(`Resizing virtual select`, () => {
  test(
    'Should place second option lower, when the select becomes narrower',
    setupTest(async page => {
      await page.clickSelect();
      const { top: topBefore } = await page.getOptionBox(2);
      await page.shrinkSelect(true);
      await page.waitForJsTimers();
      const { top: topAfter } = await page.getOptionBox(2);
      expect(topBefore).toBeLessThan(topAfter);
    })
  );
  test(
    'Should place second option higher, when the select becomes wider',
    setupTest(async page => {
      await page.shrinkSelect(true);
      await page.clickSelect();
      const { top: topBefore } = await page.getOptionBox(2);
      await page.shrinkSelect(false);
      await page.waitForJsTimers();
      const { top: topAfter } = await page.getOptionBox(2);
      expect(topBefore).toBeGreaterThan(topAfter);
    })
  );
  test(
    'Should place second option lower, when the hidden tag is revealed in the first option',
    setupTest(async page => {
      await page.clickSelect();
      const { top: topBefore } = await page.getOptionBox(2);
      await page.keys(['o', 'p', 't']);
      await page.waitForJsTimers();
      const { top: topAfter } = await page.getOptionBox(2);
      expect(topBefore).toBeLessThan(topAfter);
    })
  );
  test(
    'Should place second option higher, when the hidden tag gets hidden in the first option',
    setupTest(async page => {
      await page.clickSelect();
      await page.keys(['o', 'p', 't']);
      const { top: topBefore } = await page.getOptionBox(2);
      await page.keys('i');
      await page.waitForJsTimers();
      const { top: topAfter } = await page.getOptionBox(2);
      expect(topBefore).toBeGreaterThan(topAfter);
    })
  );
});
