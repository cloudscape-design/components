// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const withContentWrapper = createWrapper('[data-testid="with-content"]').findInput();
const withoutContentWrapper = createWrapper('[data-testid="without-content"]').findInput();
const overflowWrapper = createWrapper('[data-testid="overflow"]').findInput();

class Page extends BasePageObject {
  runScript<T>(fn: (...args: any[]) => T, ...args: string[]): Promise<T> {
    return (this.browser as any).execute(fn, ...args);
  }
}

const setupTest = (testFn: (page: Page) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new Page(browser);
    await browser.url('#/light/input/leading-content');
    await page.waitForVisible(withContentWrapper.findNativeInput().toSelector());
    await testFn(page);
  });
};

describe('Input leadingContent slot', () => {
  test(
    'renders leadingContent slot when prop is set',
    setupTest(async page => {
      await expect(page.isExisting(withContentWrapper.findLeadingContent().toSelector())).resolves.toBe(true);
    })
  );

  test(
    'does not render leadingContent slot when prop is absent',
    setupTest(async page => {
      await expect(page.isExisting(withoutContentWrapper.findLeadingContent().toSelector())).resolves.toBe(false);
    })
  );

  test(
    'slot wrapper is not aria-hidden',
    setupTest(async page => {
      const ariaHidden = await page.getElementAttribute(
        withContentWrapper.findLeadingContent().toSelector(),
        'aria-hidden'
      );
      expect(ariaHidden).toBeNull();
    })
  );

  test(
    'slot wrapper scrolls horizontally when content overflows',
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
