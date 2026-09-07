// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const presentWrapper = createWrapper('[data-testid="slot-present"]').findInput();
const absentWrapper = createWrapper('[data-testid="slot-absent"]').findInput();
const overflowWrapper = createWrapper('[data-testid="slot-overflow"]').findInput();
const interactiveWrapper = createWrapper('[data-testid="slot-interactive"]').findInput();
const textWrapper = createWrapper('[data-testid="slot-text"]').findInput();
const prefixSuffixWrapper = createWrapper('[data-testid="slot-with-prefix-suffix"]').findInput();

class Page extends BasePageObject {
  runScript<T>(fn: (...args: any[]) => T, ...args: string[]): Promise<T> {
    return (this.browser as any).execute(fn, ...args);
  }
}

const setupTest = (testFn: (page: Page) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new Page(browser);
    await browser.url('#/light/input/leading-content');
    await page.waitForVisible(presentWrapper.findNativeInput().toSelector());
    await testFn(page);
  });
};

describe('Input leadingContent slot', () => {
  describe('slot presence', () => {
    test(
      'renders slot when leadingContent is set',
      setupTest(async page => {
        await expect(page.isExisting(presentWrapper.findLeadingContent().toSelector())).resolves.toBe(true);
      })
    );

    test(
      'does not render slot when leadingContent is absent',
      setupTest(async page => {
        await expect(page.isExisting(absentWrapper.findLeadingContent().toSelector())).resolves.toBe(false);
      })
    );
  });

  describe('accessibility contract', () => {
    test(
      'slot wrapper is not aria-hidden',
      setupTest(async page => {
        const ariaHidden = await page.getElementAttribute(
          presentWrapper.findLeadingContent().toSelector(),
          'aria-hidden'
        );
        expect(ariaHidden).toBeNull();
      })
    );
  });

  describe('overflow scroll', () => {
    test(
      'slot scrolls horizontally when content overflows',
      setupTest(async page => {
        const isScrollable = await page.runScript(function (selector) {
          const el = document.querySelector(selector) as HTMLElement | null;
          return el ? el.scrollWidth > el.clientWidth : false;
        }, overflowWrapper.findLeadingContent().toSelector());
        expect(isScrollable).toBe(true);
      })
    );

    test(
      'native input remains visible when slot overflows',
      setupTest(async page => {
        const inputRect = await page.runScript(function (selector) {
          const el = document.querySelector(selector);
          return el ? el.getBoundingClientRect().toJSON() : null;
        }, overflowWrapper.findNativeInput().toSelector());
        const containerRect = await page.runScript(function (selector) {
          const el = document.querySelector(selector);
          return el ? el.getBoundingClientRect().toJSON() : null;
        }, overflowWrapper.toSelector());
        expect(inputRect).not.toBeNull();
        expect((inputRect as DOMRect).width).toBeGreaterThan(0);
        expect((inputRect as DOMRect).right).toBeLessThanOrEqual((containerRect as DOMRect).right + 1);
      })
    );
  });

  describe('interactive content in slot', () => {
    test(
      'interactive element inside slot is clickable',
      setupTest(async page => {
        const buttonSelector = `${interactiveWrapper.findLeadingContent().toSelector()} button`;
        await expect(page.isExisting(buttonSelector)).resolves.toBe(true);
        // Clicking should not throw
        await page.click(buttonSelector);
      })
    );
  });

  describe('plain text content', () => {
    test(
      'non-interactive text content renders in slot',
      setupTest(async page => {
        const text = await page.getText(textWrapper.findLeadingContent().toSelector());
        expect(text).toContain('Filter:');
      })
    );
  });

  describe('slot alongside prefix and suffix', () => {
    test(
      'leadingContent renders alongside prefix and suffix',
      setupTest(async page => {
        await expect(page.isExisting(prefixSuffixWrapper.findLeadingContent().toSelector())).resolves.toBe(true);
        await expect(page.isExisting(prefixSuffixWrapper.findPrefix().toSelector())).resolves.toBe(true);
        await expect(page.isExisting(prefixSuffixWrapper.findSuffix().toSelector())).resolves.toBe(true);
      })
    );
  });
});
