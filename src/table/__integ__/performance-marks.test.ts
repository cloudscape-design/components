// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

function setupTest(
  testFn: (parameters: {
    page: BasePageObject;
    getMarks: () => Promise<PerformanceMark[]>;
    isElementPerformanceMarkExisting: (id: string) => Promise<boolean>;
  }) => Promise<void>
) {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/table/performance-marks');
    const getMarks = async () => {
      const marks = await browser.execute(() => performance.getEntriesByType('mark') as PerformanceMark[]);
      return marks.filter(m => m.detail?.source === 'awsui');
    };
    const isElementPerformanceMarkExisting = (id: string) =>
      page.isExisting(`[data-analytics-performance-mark="${id}"]`);

    await testFn({ page, getMarks, isElementPerformanceMarkExisting });
  });
}

describe('Table', () => {
  test(
    'Emits a mark only for visible tables',
    setupTest(async ({ getMarks, isElementPerformanceMarkExisting }) => {
      const marks = await getMarks();

      expect(marks).toHaveLength(2);
      expect(marks[0].name).toBe('tableRendered');
      expect(marks[0].detail).toEqual({
        source: 'awsui',
        instanceIdentifier: expect.any(String),
        loading: true,
        header: 'This is my table',
      });

      expect(marks[1].name).toBe('tableRendered');
      expect(marks[1].detail).toEqual({
        source: 'awsui',
        instanceIdentifier: expect.any(String),
        loading: false,
        header: 'A table without the Header component',
      });

      expect(marks[0].detail.instanceIdentifier).not.toEqual(marks[1].detail.instanceIdentifier);

      await expect(isElementPerformanceMarkExisting(marks[0].detail.instanceIdentifier)).resolves.toBeTruthy();
    })
  );

  test(
    'Emits a mark when properties change',
    setupTest(async ({ page, getMarks, isElementPerformanceMarkExisting }) => {
      await page.click('#loading');
      let marks = await getMarks();

      expect(marks).toHaveLength(3);
      expect(marks[2].name).toBe('tableUpdated');
      expect(marks[2].detail).toMatchObject({
        source: 'awsui',
        instanceIdentifier: marks[0].detail.instanceIdentifier,
        loading: false,
        header: 'This is my table',
      });
      await expect(isElementPerformanceMarkExisting(marks[2].detail.instanceIdentifier)).resolves.toBeTruthy();

      await page.click('#loading');

      marks = await getMarks();

      expect(marks[3].name).toBe('tableUpdated');
      expect(marks[3].detail).toMatchObject({
        source: 'awsui',
        instanceIdentifier: marks[2].detail.instanceIdentifier,
        loading: true,
        header: 'This is my table',
      });
      await expect(isElementPerformanceMarkExisting(marks[2].detail.instanceIdentifier)).resolves.toBeTruthy();
    })
  );
});
