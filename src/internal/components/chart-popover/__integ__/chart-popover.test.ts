// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../../../lib/components/test-utils/selectors';

test.each([false, true])('can be unpinned by clicking outside, iframe=%s', async iframe => {
  await useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url(`#/light/charts.test?iframe=${iframe}`);
    await page.runInsideIframe('#content-iframe', iframe, async () => {
      const chart = createWrapper().findLineChart();
      const popover = chart.findDetailPopover();
      const popoverDismiss = popover.findDismissButton();

      // Show popover with an offset from chart's center.
      await page.hoverElement(chart.toSelector(), 100);
      // Pin the popover by clicking on the left from it to ensure the click lands on the SVG, not popover content.
      await page.click(chart.toSelector());
      await page.waitForAssertion(() => expect(page.isDisplayed(popoverDismiss.toSelector())).resolves.toBe(true));
      await page.waitForAssertion(() => expect(page.isFocused(popoverDismiss.toSelector())).resolves.toBe(true));

      // Unpin by clicking outside the chart.
      await page.click('h2');
      await expect(page.isDisplayed(popover.toSelector())).resolves.toBe(false);
    });
  })();
});
