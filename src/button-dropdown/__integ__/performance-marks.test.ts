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
    await browser.url(`#/light/button-dropdown/${pageName}`);
    const getMarks = async () => {
      await new Promise(r => setTimeout(r, 200));
      const marks = await browser.execute(() => performance.getEntriesByType('mark') as PerformanceMark[]);
      return marks.filter(m => m.detail?.source === 'awsui');
    };
    const getElementPerformanceMarkText = (id: string) => page.getText(`[data-analytics-performance-mark="${id}"]`);

    await testFn({ page, getMarks, getElementPerformanceMarkText });
  });
}

describe('ButtonDropdown', () => {
  test(
    'Emits a single mark',
    setupTest('main-action', async ({ getMarks, getElementPerformanceMarkText }) => {
      const marks = await getMarks();

      expect(marks).toHaveLength(1);
      expect(marks[0].name).toBe('primaryButtonRendered');
      expect(marks[0].detail).toMatchObject({
        source: 'awsui',
        instanceIdentifier: expect.any(String),
        loading: false,
        disabled: false,
        inViewport: true,
        text: 'Launch instance',
      });

      await expect(getElementPerformanceMarkText(marks[0].detail.instanceIdentifier)).resolves.toBe('Launch instance');
    })
  );
});
