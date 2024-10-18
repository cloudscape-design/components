// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

function setupTest(linksIn: string, testFn: (page: BasePageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url(`#/light/pie-chart/with-links-in-${linksIn}`);
    await testFn(page);
  });
}

describe('Pie chart with links in key-value pairs', () => {
  describe.each(['keys', 'values'])('with links in the %s', linksIn => {
    it(
      'allows to focus internal popover content',
      setupTest(linksIn, async page => {
        const expectedFocusedText =
          linksIn === 'keys'
            ? // The external link icon adds an extra space at the end
              'Popularity '
            : '50% ';
        await page.click('#focus-target');
        await page.keys(['Tab']); // Focus the chart
        await page.keys(['Enter']); // Focus the first chart segment
        await page.keys(['Tab']); // Focus the first interactive element in the detail popover
        await expect(page.getFocusedElementText()).resolves.toBe(expectedFocusedText);
      })
    );
    it(
      'announces detail popover content in plain text when focusing a segment',
      setupTest(linksIn, async page => {
        await page.initLiveAnnouncementsObserver();
        await page.click('#focus-target');
        await page.keys(['Tab']); // Focus the chart
        await page.keys(['Enter']); // Focus the first chart segment
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for live region timeout
        const announcements = await page.getLiveAnnouncements();
        expect(announcements.some(text => /Popularity\s*50%\s*Calories per 100g\s*77 kcal/.test(text))).toBe(true);
      })
    );
  });
});
