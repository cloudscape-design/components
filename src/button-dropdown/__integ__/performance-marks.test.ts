// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

function getMarkSelector(mark: PerformanceMark) {
  return `[data-analytics-performance-mark="${mark.detail.instanceIdentifier}"]`;
}

test(
  'ButtonDropdown emits a single mark',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/button-dropdown/main-action');
    await new Promise(r => setTimeout(r, 200));

    await page.waitForAssertion(async () => {
      const allMarks = await browser.execute(() => performance.getEntriesByType('mark') as PerformanceMark[]);
      const awsuiMarks = allMarks.filter(m => m.detail?.source === 'awsui');

      expect(awsuiMarks).toHaveLength(1);
      expect(awsuiMarks[0].name).toBe('primaryButtonRendered');
      expect(awsuiMarks[0].detail).toMatchObject({
        source: 'awsui',
        instanceIdentifier: expect.any(String),
        loading: false,
        disabled: false,
        inViewport: true,
        text: 'Launch instance',
      });
      await expect(page.getText(getMarkSelector(awsuiMarks[0]))).resolves.toBe('Launch instance');
    });
  })
);
