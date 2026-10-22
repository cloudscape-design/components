// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();
const singleList = wrapper.findOptionList('[data-testid="single"]');
const multiList = wrapper.findOptionList('[data-testid="multi"]');
const singleValue = '[data-testid="single-value"]';
const multiValue = '[data-testid="multi-value"]';

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) =>
  useBrowser(async browser => {
    await browser.url('#/light/option-list/simple');
    const page = new BasePageObject(browser);
    await page.waitForVisible(singleList.toSelector());
    await testFn(page);
  });

class ScrollPage extends BasePageObject {
  /** Whether the highlighted option is inside the viewport and inside every scrolling ancestor. */
  isHighlightVisible(listSelector: string) {
    const highlighted = wrapper.findOptionList(listSelector).findHighlightedOption().toSelector();
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
    }, highlighted);
  }

  getHighlightedText(listSelector: string) {
    return this.getText(wrapper.findOptionList(listSelector).findHighlightedOption().findLabel().toSelector());
  }

  async pressRepeatedly(key: string, count: number) {
    for (let i = 0; i < count; i++) {
      await this.keys([key]);
    }
  }

  /** Presses each key and asserts the highlight stays visible. PageDown does not move the highlight. */
  async assertKeyboardScrolling(listSelector: string, { arrowDownCount }: { arrowDownCount: number }) {
    await this.pressRepeatedly('ArrowDown', arrowDownCount);
    await expect(this.isHighlightVisible(listSelector)).resolves.toBe(true);

    await this.keys(['End']);
    await expect(this.isHighlightVisible(listSelector)).resolves.toBe(true);

    await this.keys(['Home']);
    await expect(this.isHighlightVisible(listSelector)).resolves.toBe(true);

    await this.keys(['ArrowUp']);
    await expect(this.isHighlightVisible(listSelector)).resolves.toBe(true);

    await this.keys(['Home', 'PageDown', 'ArrowDown']);
    await expect(this.isHighlightVisible(listSelector)).resolves.toBe(true);
  }
}

const setupScrollTest = (url: string, testFn: (page: ScrollPage) => Promise<void>) =>
  useBrowser({ width: 1200, height: 800 }, async browser => {
    await browser.url(url);
    const page = new ScrollPage(browser);
    await page.waitForVisible('h1');
    await testFn(page);
  });

describe('OptionList keyboard scrolling', () => {
  describe.each(['wrapper-fixed', 'wrapper-max', 'root', 'page'])('container=%s', container => {
    const list = '[data-testid="option-list"]';
    const focusList = async (page: ScrollPage) => {
      await page.click('#option-list-heading');
      await page.keys(['Tab']);
      await expect(page.isFocused(wrapper.findOptionList(list).findOptionsContainer().toSelector())).resolves.toBe(
        true
      );
    };

    test.each(['single', 'multi'])('selectionType=%s keeps the highlighted option visible', selectionType =>
      setupScrollTest(
        `#/light/option-list/scroll?container=${container}&selectionType=${selectionType}`,
        async page => {
          await focusList(page);
          await page.assertKeyboardScrolling(list, { arrowDownCount: 40 });
          await page.keys(['End']);
          await expect(page.getHighlightedText(list)).resolves.toBe('Option 100');
          await expect(page.isHighlightVisible(list)).resolves.toBe(true);
        }
      )()
    );

    test(
      'focus entry scrolls to a preselected option near the end',
      setupScrollTest(`#/light/option-list/scroll?container=${container}&preselected=near-end`, async page => {
        await focusList(page);
        await expect(page.getHighlightedText(list)).resolves.toBe('Option 81');
        await expect(page.isHighlightVisible(list)).resolves.toBe(true);
      })
    );
  });

  describe.each([false, true])('in a Dropdown, expandToViewport=%s', expandToViewport => {
    const url = `#/light/option-list/in-dropdown?longList=true&expandToViewport=${expandToViewport}`;

    test.each(['diy-select', 'diy-multiselect'])(
      '%s keeps the highlighted option visible without scrolling the page on open',
      id =>
        setupScrollTest(url, async page => {
          const list = `#${id}-list`;
          const scrollBefore = await page.getWindowScroll();
          await page.click(`#${id}-trigger`);
          await page.waitForVisible(list);
          await expect(page.isFocused(wrapper.findOptionList(list).findOptionsContainer().toSelector())).resolves.toBe(
            true
          );
          await expect(page.getWindowScroll()).resolves.toEqual(scrollBefore);
          await page.assertKeyboardScrolling(list, { arrowDownCount: 30 });
        })()
    );
  });
});

describe('OptionList', () => {
  test(
    'selects an option with a click anywhere on the row',
    setupTest(async page => {
      await page.click(singleList.findOptionByValue('performance').findDescription().toSelector());
      await expect(page.getText(singleValue)).resolves.toBe('Selected: performance');
      await expect(page.getElementsCount(singleList.findSelectedOptions().toSelector())).resolves.toBe(1);
    })
  );

  test(
    'selects with the keyboard: Tab into the list, arrows move, Enter selects',
    setupTest(async page => {
      await page.click('#single-heading');
      await page.keys(['Tab']);
      await expect(page.isFocused(singleList.findOptionsContainer().toSelector())).resolves.toBe(true);
      await page.keys(['ArrowDown', 'ArrowDown', 'Enter']);
      await expect(page.getText(singleValue)).resolves.toBe('Selected: reliability');
    })
  );

  test(
    'toggles several options in multi selection',
    setupTest(async page => {
      await page.click(multiList.findOptionByValue('cost').toSelector());
      await page.click(multiList.findOptionByValue('security').toSelector());
      await expect(page.getText(multiValue)).resolves.toBe('Selected: cost, security');
      await page.click(multiList.findOptionByValue('cost').toSelector());
      await expect(page.getText(multiValue)).resolves.toBe('Selected: security');
    })
  );

  test(
    'Tab leaves the list after one stop',
    setupTest(async page => {
      await page.click('#single-heading');
      await page.keys(['Tab', 'Tab']);
      await expect(page.isFocused(singleList.findOptionsContainer().toSelector())).resolves.toBe(false);
      await expect(page.isFocused(multiList.findOptionsContainer().toSelector())).resolves.toBe(true);
    })
  );
});
