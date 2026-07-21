// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type { Browser } from 'webdriverio';

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

const scrollContainerSelector = '#auto-skeleton-scroll-container';
const innerScrollContainerSelector = '#auto-skeleton-inner-scroll-container';
const skeletonRowSelector = `${innerScrollContainerSelector} tr[aria-hidden="true"]`;

async function expectNoVerticalOverflow(browser: Browser, selector: string) {
  await expect(
    browser.execute(scrollContainerSelector => {
      const scrollContainer = document.querySelector<HTMLElement>(scrollContainerSelector)!;
      return scrollContainer.scrollHeight - scrollContainer.clientHeight;
    }, selector)
  ).resolves.toBeLessThanOrEqual(0);
}

test(
  'fits automatic skeleton rows inside nested scroll viewports',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/table/auto-skeleton-rows');
    await page.waitForVisible(skeletonRowSelector);

    await expectNoVerticalOverflow(browser, scrollContainerSelector);
    await expectNoVerticalOverflow(browser, innerScrollContainerSelector);
  })
);
