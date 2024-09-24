// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

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
    await browser.url(`#/light/button-dropdown/${pageName}`);
    const getMarks = async () => {
      const marks = await browser.execute(() => performance.getEntriesByType('mark') as PerformanceMark[]);
      return marks.filter(m => m.detail?.source === 'awsui');
    };
    const getElementByPerformanceMark = async (id: string) => {
      const element = await browser.$(`[data-analytics-performance-mark="${id}"]`);
      return element;
    };

    await testFn({ page, getMarks, getElementByPerformanceMark });
  });
}

describe('ButtonDropdown', () => {
  test(
    'Emits a single mark',
    setupTest('main-action', async ({ getMarks, getElementByPerformanceMark }) => {
      const marks = await getMarks();

      expect(marks).toHaveLength(1);
      expect(marks[0].name).toBe('primaryButtonRendered');
      expect(marks[0].detail).toMatchObject({
        source: 'awsui',
        instanceIdentifier: expect.any(String),
        loading: false,
        disabled: false,
        text: 'Launch instance',
      });

      expect(await getElementByPerformanceMark(marks[0].detail.instanceIdentifier).then(e => e.getText())).toBe(
        'Launch instance'
      );
    })
  );
});
