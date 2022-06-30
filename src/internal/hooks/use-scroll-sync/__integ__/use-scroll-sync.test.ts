// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

export default class ScrollSyncPage extends BasePageObject {
  async assertNumberOfCalls(lessThan: number) {
    const str = await this.getElementAttribute('#numberOfCalls', 'data-call-number');
    await expect(parseInt(str)).toBeLessThan(lessThan);
  }
  async assertScrollLeft(value: number) {
    const element1ScrollLeft = await this.getElementProperty('#element1', 'scrollLeft');
    const element2ScrollLeft = await this.getElementProperty('#element2', 'scrollLeft');
    expect(element1ScrollLeft).toEqual(value);
    expect(element2ScrollLeft).toEqual(value);
  }
}

describe('use-scroll-sync', () => {
  const setupTest = (testFn: (page: ScrollSyncPage) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new ScrollSyncPage(browser);
      await browser.url('#/light/sync-scrolls');
      await page.waitForVisible('#element1');
      await testFn(page);
    });
  };

  test(
    'should not cause event chain reaction',
    setupTest(async page => {
      await page.elementScrollTo('#element1', { left: 10 });
      // we want to avoid a "chain reaction" with a bunch of events firing back and forth
      // we have two elements which could cause parent scroll.
      // checking that event listener is triggered no more than 2 times per scroll
      await page.assertNumberOfCalls(3);
      await page.assertScrollLeft(10);

      await page.elementScrollTo('#element2', { left: 20 });
      await page.assertNumberOfCalls(5);
      await page.assertScrollLeft(20);

      await page.elementScrollTo('#element2', { left: 0 });
      await page.assertNumberOfCalls(7);
      await page.assertScrollLeft(0);
    })
  );
});
