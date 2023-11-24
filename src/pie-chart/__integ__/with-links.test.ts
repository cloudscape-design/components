// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

function setupTest(useLinks: string, testFn: (page: BasePageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url(`#/light/pie-chart/with-links?useLinks=${useLinks}`);
    await testFn(page);
  });
}

describe('Pie chart with links in key-value pairs', () => {
  describe.each(['keys', 'values'])('with links in the %s', useLinks => {
    it(
      'allows to focus internal popover content',
      setupTest(useLinks, async page => {
        const expectedFocusedText =
          useLinks === 'keys'
            ? // The external link icon adds an extra space at the end
              'Popularity '
            : '50% ';
        await page.click('#focus-target');
        await page.keys(['Tab', 'Enter']);
        await page.keys(['Tab']);
        await expect(page.getFocusedElementText()).resolves.toBe(expectedFocusedText);
      })
    );
    it(
      'announces detail popover content in plain text when focusing a segment',
      setupTest(useLinks, async page => {
        await page.initLiveAnnouncementsObserver();
        await page.click('#focus-target');
        await page.keys(['Tab']);
        await page.keys(['Enter']);
        await expect(page.getLiveAnnouncements()).resolves.toContain('Popularity 50% Calories per 100g 77 kcal');
      })
    );
  });
});
