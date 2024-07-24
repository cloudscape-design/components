// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import AutosuggestPage from './page-objects/autosuggest-page';

interface ExtendedWindow extends Window {
  __shrinkComponent?: (shrunk: boolean) => void;
}
declare const window: ExtendedWindow;

class ResizeAutosuggestPage extends AutosuggestPage {
  async shrinkAutosuggest(shrunk: boolean) {
    await this.browser.execute(shrunk => window.__shrinkComponent && window.__shrinkComponent(shrunk), shrunk);
  }
  async getOptionBox(index: number) {
    const optionSelector = this.wrapper.findDropdown().findOption(index).toSelector();
    const boundingBox = await this.getBoundingBox(optionSelector);
    return boundingBox;
  }
}

function setupTest(testFn: (page: ResizeAutosuggestPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new ResizeAutosuggestPage(browser);
    await browser.url('/#/light/autosuggest/virtual-resize');
    await testFn(page);
  });
}

describe(`Resizing virtual autosuggest`, () => {
  test(
    'Should place second option lower, when the autosuggest becomes narrower',
    setupTest(async page => {
      await page.focusInput();
      const { top: topBefore } = await page.getOptionBox(2);
      await page.shrinkAutosuggest(true);
      await page.waitForJsTimers();
      const { top: topAfter } = await page.getOptionBox(2);
      expect(topBefore).toBeLessThan(topAfter);
    })
  );
  test(
    'Should place second option higher, when the autosuggest becomes wider',
    setupTest(async page => {
      await page.shrinkAutosuggest(true);
      await page.focusInput();
      const { top: topBefore } = await page.getOptionBox(2);
      await page.shrinkAutosuggest(false);
      await page.waitForJsTimers();
      const { top: topAfter } = await page.getOptionBox(2);
      expect(topBefore).toBeGreaterThan(topAfter);
    })
  );
  test(
    'Should place second option lower, when the hidden tag is revealed in the first option',
    setupTest(async page => {
      await page.focusInput();
      // force "Use:" option to appear
      await page.keys(['o', 'p', 't', 'i']);
      const { top: topBefore } = await page.getOptionBox(2);
      await page.keys('Backspace');
      await page.waitForJsTimers();
      const { top: topAfter } = await page.getOptionBox(2);
      expect(topBefore).toBeLessThan(topAfter);
    })
  );
  test(
    'Should place second option higher, when the hidden tag gets hidden in the first option',
    setupTest(async page => {
      await page.focusInput();
      // force "Use:" option to appear
      await page.keys(['o', 'p', 't']);
      const { top: topBefore } = await page.getOptionBox(2);
      await page.keys('i');
      await page.waitForJsTimers();
      const { top: topAfter } = await page.getOptionBox(2);
      expect(topBefore).toBeGreaterThan(topAfter);
    })
  );
});
