// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

interface ExtendedWindow extends Window {
  renders: Record<string, number>;
}
declare const window: ExtendedWindow;

class AsyncStorePageObject extends BasePageObject {
  getRenderCounters() {
    return this.browser.execute(() => {
      return window.renders;
    });
  }
}

const setupTest = (testFn: (page: AsyncStorePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new AsyncStorePageObject(browser);
    await browser.url('/#/light/async-store/async-store-test');
    await testFn(page);
  });
};

test(
  'subscribed elements render expected amount of times',
  setupTest(async page => {
    expect(await page.getRenderCounters()).toEqual({ west: 1, east: 1, westwest: 1, westeast: 1 });

    await page.click('[data-testid="westeast"]');
    expect(await page.getRenderCounters()).toEqual({ west: 2, east: 2, westwest: 2, westeast: 2 });

    await page.click('[data-testid="west"]');
    expect(await page.getRenderCounters()).toEqual({ west: 3, east: 2, westwest: 3, westeast: 3 });

    await page.click('[data-testid="east"]');
    expect(await page.getRenderCounters()).toEqual({ west: 3, east: 3, westwest: 3, westeast: 4 });
  })
);
