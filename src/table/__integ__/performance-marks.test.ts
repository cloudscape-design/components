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
    'Emits a mark only for visible tables which are loaded completely',
    setupTest(async ({ getMarks, isElementPerformanceMarkExisting }) => {
      const marks = await getMarks();

      expect(marks).toHaveLength(1);
      expect(marks[0].name).toBe('tableRendered');
      expect(marks[0].detail).toEqual({
        source: 'awsui',
        instanceIdentifier: expect.any(String),
        loading: false,
        header: 'A table without the Header component',
      });
      await expect(isElementPerformanceMarkExisting(marks[0].detail.instanceIdentifier)).resolves.toBeTruthy();
    })
  );

  test(
    'Emits a mark when properties change',
    setupTest(async ({ page, getMarks, isElementPerformanceMarkExisting }) => {
      await page.click('#loading');
      const marks = await getMarks();

      expect(marks).toHaveLength(2);
      expect(marks[1].name).toBe('tableUpdated');
      expect(marks[1].detail).toMatchObject({
        source: 'awsui',
        instanceIdentifier: expect.any(String),
        loading: false,
        header: 'This is my table',
      });
      await expect(isElementPerformanceMarkExisting(marks[1].detail.instanceIdentifier)).resolves.toBeTruthy();
    })
  );

  test(
    'Emits a mark for loaded table components when evaluateComponentVisibility event is emitted',
    setupTest(async ({ page, getMarks, isElementPerformanceMarkExisting }) => {
      let marks = await getMarks();
      expect(marks).toHaveLength(1);
      expect(marks[0].name).toBe('tableRendered');
      expect(marks[0].detail).toEqual({
        source: 'awsui',
        instanceIdentifier: expect.any(String),
        loading: false,
        header: 'A table without the Header component',
      });

      await expect(isElementPerformanceMarkExisting(marks[0].detail.instanceIdentifier)).resolves.toBeTruthy();
      await page.click('#evaluateComponentVisibility');
      marks = await getMarks();
      expect(marks).toHaveLength(2);

      expect(marks[1].name).toBe('tableUpdated');
      expect(marks[1].detail).toEqual({
        source: 'awsui',
        instanceIdentifier: expect.any(String),
        loading: false,
        header: 'A table without the Header component',
      });
    })
  );
});
