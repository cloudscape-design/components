// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const list = createWrapper().findOptionList('[data-testid="option-list"]');
const listbox = `${list.toSelector()} [role="listbox"]`;

class ScrollPage extends BasePageObject {
  /** Whether the highlighted option is inside the viewport and inside every scrolling ancestor. */
  isHighlightVisible() {
    return this.browser.execute(selector => {
      const option = document.querySelector(selector);
      if (!option) {
        return false;
      }
      const rect = option.getBoundingClientRect();
      const within = (top: number, bottom: number) => rect.top >= top - 1 && rect.bottom <= bottom + 1;
      for (let parent = option.parentElement; parent; parent = parent.parentElement) {
        const { overflowY } = getComputedStyle(parent);
        if ((overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight) {
          const parentRect = parent.getBoundingClientRect();
          if (!within(parentRect.top + parent.clientTop, parentRect.top + parent.clientTop + parent.clientHeight)) {
            return false;
          }
        }
      }
      return within(0, window.innerHeight);
    }, list.findHighlightedOption().toSelector());
  }

  getHighlightedText() {
    return this.getText(list.findHighlightedOption().findLabel().toSelector());
  }

  /** Scrolls the list's nearest scroll container (or the page) back to the top, away from the highlight. */
  scrollToTop() {
    return this.browser.execute(selector => {
      for (let parent = document.querySelector(selector)!.parentElement; parent; parent = parent.parentElement) {
        const { overflowY } = getComputedStyle(parent);
        if ((overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight) {
          parent.scrollTop = 0;
          return;
        }
      }
      window.scrollTo(0, 0);
    }, listbox);
  }

  async expectHighlightVisibleAfter(keys: string[]) {
    await this.keys(keys);
    await expect(this.isHighlightVisible()).resolves.toBe(true);
  }

  async assertKeyboardScrolling() {
    for (let i = 0; i < 30; i++) {
      await this.keys(['ArrowDown']);
    }
    await expect(this.isHighlightVisible()).resolves.toBe(true);

    await this.expectHighlightVisibleAfter(['End']);
    await expect(this.getHighlightedText()).resolves.toBe('Option 100');
    await this.expectHighlightVisibleAfter(['Home']);
    await expect(this.getHighlightedText()).resolves.toBe('Option 1');
    await this.expectHighlightVisibleAfter(['ArrowUp']);
    await expect(this.getHighlightedText()).resolves.toBe('Option 100');

    await this.scrollToTop();
    await this.expectHighlightVisibleAfter(['ArrowDown']);
    await expect(this.getHighlightedText()).resolves.toBe('Option 1');
  }
}

const setupTest = (url: string, testFn: (page: ScrollPage) => Promise<void>) =>
  useBrowser({ width: 1200, height: 800 }, async browser => {
    await browser.url(url);
    const page = new ScrollPage(browser);
    await page.waitForVisible('h1');
    await testFn(page);
  });

describe('OptionList keyboard scrolling', () => {
  describe.each(['wrapper', 'root', 'page'])('container=%s', container => {
    const focusList = async (page: ScrollPage) => {
      await page.click('#option-list-heading');
      await page.keys(['Tab']);
      await expect(page.isFocused(listbox)).resolves.toBe(true);
    };

    test(
      'keeps the highlighted option visible',
      setupTest(`#/light/option-list/scroll?container=${container}`, async page => {
        await focusList(page);
        await page.assertKeyboardScrolling();
      })
    );

    test(
      'focus entry scrolls to a preselected option near the end',
      setupTest(`#/light/option-list/scroll?container=${container}&preselected=near-end`, async page => {
        await focusList(page);
        await expect(page.getHighlightedText()).resolves.toBe('Option 81');
        await expect(page.isHighlightVisible()).resolves.toBe(true);
      })
    );
  });

  describe.each([false, true])('in a Dropdown, expandToViewport=%s', expandToViewport => {
    test(
      'keeps the highlighted option visible without scrolling the page on open',
      setupTest(`#/light/option-list/scroll?container=dropdown&expandToViewport=${expandToViewport}`, async page => {
        const scrollBefore = await page.getWindowScroll();
        await page.click('#dropdown-trigger');
        await page.waitForVisible(listbox);
        await expect(page.isFocused(listbox)).resolves.toBe(true);
        await expect(page.getWindowScroll()).resolves.toEqual(scrollBefore);
        await page.assertKeyboardScrolling();
      })
    );
  });
});
