// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

function setupTest(
  pageName: string,
  testFn: (parameters: {
    page: BasePageObject;
    getMarks: () => Promise<PerformanceMark[]>;
    getElementByPerformanceMark: (id: string) => Promise<WebdriverIO.Element>;
  }) => Promise<void>
) {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url(`#/light/button/${pageName}`);
    const getMarks = async () => {
      const marks = await browser.execute(() => performance.getEntriesByType('mark') as PerformanceMark[]);
      return marks.filter(m => m.detail?.source === 'awsui');
    };
    const getElementByPerformanceMark = (id: string) => browser.$(`[data-analytics-performance-marker="${id}"]`);

    await testFn({ page, getMarks, getElementByPerformanceMark });
  });
}

describe('Button', () => {
  test(
    'Emits a mark only for primary visible buttons',
    setupTest('performance-marks', async ({ getMarks, getElementByPerformanceMark }) => {
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

      expect(await getElementByPerformanceMark(marks[0].detail.instanceIdentifier).then(e => e.getText())).toBe(
        'Primary button'
      );
    })
  );

  test(
    'Emits a mark when properties change',
    setupTest('performance-marks', async ({ page, getMarks, getElementByPerformanceMark }) => {
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

      expect(await getElementByPerformanceMark(marks[1].detail.instanceIdentifier).then(e => e.getText())).toBe(
        'Primary button'
      );

      expect(marks[2].name).toBe('primaryButtonUpdated');
      expect(marks[2].detail).toMatchObject({
        source: 'awsui',
        instanceIdentifier: marks[1].detail.instanceIdentifier,
        loading: false,
        disabled: true,
        text: 'Primary button',
      });

      expect(await getElementByPerformanceMark(marks[2].detail.instanceIdentifier).then(e => e.getText())).toBe(
        'Primary button'
      );
    })
  );

  test(
    'Does not emit a mark when inside a modal',
    setupTest('performance-marks-in-modal', async ({ getMarks, getElementByPerformanceMark }) => {
      const marks = await getMarks();

      expect(marks).toHaveLength(1);
      expect(marks[0].detail).toMatchObject({
        text: 'Button OUTSIDE modal',
      });
      expect(await getElementByPerformanceMark(marks[0].detail.instanceIdentifier).then(e => e.getText())).toBe(
        'Button OUTSIDE modal'
      );
    })
  );
});
