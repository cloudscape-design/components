// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import AutosuggestPage from './page-objects/autosuggest-page';

class VirtualScrollAutosuggestPage extends AutosuggestPage {
  listSelector = this.wrapper.findDropdown().findOptionsContainer().toSelector();

  async wheelOverList(deltaY: number) {
    // Wheel input is separate from the pointer, so this scrolls without hovering any option.
    const list = await this.browser.$(this.listSelector);
    await this.browser.action('wheel').scroll({ origin: list, deltaY, duration: 100 }).perform();
  }

  async getListScrollTop() {
    const { top } = await this.getElementScroll(this.listSelector);
    return top;
  }
}

function setupTest(testFn: (page: VirtualScrollAutosuggestPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new VirtualScrollAutosuggestPage(browser);
    await browser.url('/#/light/autosuggest/virtual-scroll');
    await page.focusInput();
    await page.assertDropdownOpen();
    await testFn(page);
  });
}

describe('Autosuggest with virtual scroll', () => {
  test(
    'keeps the scroll position after wheel scrolling a dropdown opened with the mouse',
    setupTest(async page => {
      await page.wheelOverList(600);
      await page.waitForJsTimers(100);
      expect(await page.getListScrollTop()).toBeGreaterThan(0);

      const scrollTop = await page.getListScrollTop();
      await page.wheelOverList(600);
      await page.waitForJsTimers(100);
      expect(await page.getListScrollTop()).toBeGreaterThan(scrollTop);
    })
  );

  test(
    'keeps the scroll position after keyboard navigation when the list is scrolled without the wheel',
    setupTest(async page => {
      await page.keys(['ArrowDown', 'ArrowDown']);
      await page.assertHighlightedOptionContains('Option 2');

      // Stands in for dragging the scrollbar.
      await page.elementScrollTo(page.listSelector, { top: 3000 });
      await page.waitForJsTimers(100);
      // The virtualizer shifts the offset slightly once it measures the newly rendered options,
      // so don't expect exactly 3000. Without the fix the list snaps back to the highlighted option at the top.
      expect(await page.getListScrollTop()).toBeGreaterThan(2500);
    })
  );

  test(
    'scrolls the highlighted option into view on keyboard navigation after the list was scrolled',
    setupTest(async page => {
      await page.elementScrollTo(page.listSelector, { top: 3000 });
      await page.waitForJsTimers(100);

      await page.keys(['ArrowDown']);
      await page.assertHighlightedOptionContains('Option 1');
      await page.waitForAssertion(async () => expect(await page.getListScrollTop()).toBe(0));
    })
  );
});
