// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

function setupTest(
  pageName: string,
  testFn: (parameters: {
    page: BasePageObject;
    getMarks: () => Promise<PerformanceMark[]>;
    getElementPerformanceMarkText: (id: string) => Promise<string>;
  }) => Promise<void>
) {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url(`#/light/button/${pageName}`);
    const getMarks = async () => {
      const marks = await browser.execute(() => performance.getEntriesByType('mark') as PerformanceMark[]);
      return marks.filter(m => m.detail?.source === 'awsui');
    };
    const getElementPerformanceMarkText = (id: string) => page.getText(`[data-analytics-performance-mark="${id}"]`);

    await testFn({ page, getMarks, getElementPerformanceMarkText });
  });
}

describe('Button', () => {
  test(
    'Emits a mark only for primary visible buttons',
    setupTest('performance-marks', async ({ getMarks, getElementPerformanceMarkText }) => {
      const marks = await getMarks();

      expect(marks).toHaveLength(1);
      expect(marks[0].name).toBe('primaryButtonRendered');
      expect(marks[0].detail).toMatchObject({
        source: 'awsui',
        instanceIdentifier: expect.any(String),
        loading: true,
        disabled: false,
        text: 'Primary button',
      });

      await expect(getElementPerformanceMarkText(marks[0].detail.instanceIdentifier)).resolves.toBe('Primary button');
    })
  );

  test(
    'Emits a mark when properties change',
    setupTest('performance-marks', async ({ page, getMarks, getElementPerformanceMarkText }) => {
      await page.click('#disabled');
      await page.click('#loading');
      const marks = await getMarks();

      expect(marks).toHaveLength(3);
      expect(marks[1].name).toBe('primaryButtonUpdated');
      expect(marks[1].detail).toMatchObject({
        source: 'awsui',
        instanceIdentifier: marks[0].detail.instanceIdentifier,
        loading: true,
        disabled: true,
        text: 'Primary button',
      });

      await expect(getElementPerformanceMarkText(marks[1].detail.instanceIdentifier)).resolves.toBe('Primary button');

      expect(marks[2].name).toBe('primaryButtonUpdated');
      expect(marks[2].detail).toMatchObject({
        source: 'awsui',
        instanceIdentifier: marks[1].detail.instanceIdentifier,
        loading: false,
        disabled: true,
        text: 'Primary button',
      });

      await expect(getElementPerformanceMarkText(marks[2].detail.instanceIdentifier)).resolves.toBe('Primary button');
    })
  );

  test(
    'Does not emit a mark when inside a modal',
    setupTest('performance-marks-in-modal', async ({ getMarks, getElementPerformanceMarkText }) => {
      const marks = await getMarks();

      expect(marks).toHaveLength(1);
      expect(marks[0].detail).toMatchObject({
        text: 'Button OUTSIDE modal',
      });
      await expect(getElementPerformanceMarkText(marks[0].detail.instanceIdentifier)).resolves.toBe(
        'Button OUTSIDE modal'
      );
    })
  );
});
