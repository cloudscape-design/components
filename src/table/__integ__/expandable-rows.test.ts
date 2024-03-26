// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';

const tableWrapper = createWrapper().findTable();

type TestPageOptions = Record<string, string>;

describe('Expandable rows', () => {
  const setupTest = (options: TestPageOptions, testFn: (page: BasePageObject) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new BasePageObject(browser);
      await page.setWindowSize({ width: 1200, height: 1000 });
      const query = new URLSearchParams(options);
      await browser.url(`#/light/table/expandable-rows-test?${query.toString()}`);
      await page.waitForVisible(tableWrapper.findBodyCell(2, 1).toSelector());
      await testFn(page);
    });
  };

  test(
    'expands and collapses item children by clicking on the expand toggle',
    setupTest({}, async page => {
      await expect(page.getElementsCount(tableWrapper.findRows().toSelector())).resolves.toBe(35);

      await page.click(tableWrapper.findExpandToggle(4).toSelector());
      await expect(page.getElementsCount(tableWrapper.findRows().toSelector())).resolves.toBe(35 + 3);

      await page.click(tableWrapper.findExpandToggle(4).toSelector());
      await expect(page.getElementsCount(tableWrapper.findRows().toSelector())).resolves.toBe(35);
    })
  );
});
