// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../../../lib/components/test-utils/selectors';

describe.each([false, true])('iframe=%s', iframe => {
  test(
    'can be unpinned by clicking outside',
    useBrowser(async browser => {
      const page = new BasePageObject(browser);
      await browser.url(`#/charts.test?iframe=${iframe}`);
      await page.runInsideIframe('#content-iframe', iframe, async () => {
        const chart = createWrapper().findLineChart();
        const popover = chart.findDetailPopover();
        const popoverDismiss = popover.findDismissButton();

        // Pins popover on the first point.
        await page.click('h2');
        await page.keys(['Tab', 'ArrowRight', 'Enter']);
        await page.waitForVisible(popoverDismiss.toSelector());

        // Unpin by clicking outside the chart.
        await page.click('h1');
        await expect(page.isDisplayed(popover.toSelector())).resolves.toBe(false);
      });
    })
  );
});
