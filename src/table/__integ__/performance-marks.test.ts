// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

function setupTest(testFn: (page: BasePageObject, getMarks: () => Promise<PerformanceMark[]>) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/table/performance-marks');
    const getMarks = async () => {
      const marks = await browser.execute(() => performance.getEntriesByType('mark') as PerformanceMark[]);
      return marks.filter(m => m.detail?.source === 'cloudscape');
    };
    await testFn(page, getMarks);
  });
}

describe('Table', () => {
  test(
    'Emits a mark only for visible tables',
    setupTest(async (_, getMarks) => {
      const marks = await getMarks();

      expect(marks).toHaveLength(2);
      expect(marks[0].name).toBe('tableRendered');
      expect(marks[0].detail).toEqual({
        source: 'cloudscape',
        instanceId: expect.any(String),
        loading: true,
        header: 'This is my table',
      });

      expect(marks[1].name).toBe('tableRendered');
      expect(marks[1].detail).toEqual({
        source: 'cloudscape',
        instanceId: expect.any(String),
        loading: false,
        header: 'A table without the Header component',
      });

      expect(marks[0].detail.instanceId).not.toEqual(marks[1].detail.instanceId);
    })
  );

  test(
    'Emits a mark when properties change',
    setupTest(async (page, getMarks) => {
      await page.click('#loading');
      let marks = await getMarks();

      expect(marks).toHaveLength(3);
      expect(marks[2].name).toBe('tableUpdated');
      expect(marks[2].detail).toMatchObject({
        source: 'cloudscape',
        instanceId: marks[0].detail.instanceId,
        loading: false,
        header: 'This is my table',
      });

      await page.click('#loading');

      marks = await getMarks();

      expect(marks[3].name).toBe('tableUpdated');
      expect(marks[3].detail).toMatchObject({
        source: 'cloudscape',
        instanceId: marks[2].detail.instanceId,
        loading: true,
        header: 'This is my table',
      });
    })
  );
});
