// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const tableWrapper = createWrapper().findTable();
const defaultScreen = { width: 1680, height: 800 };

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/table/column-groups');
    await page.setWindowSize(defaultScreen);
    await testFn(page);
  });
};

describe('Table - Grouped column resizing', () => {
  test(
    'group resizer changes group width on drag',
    setupTest(async page => {
      const groupResizerSelector = `${tableWrapper.toSelector()} thead th[scope="colgroup"] button`;
      await expect(page.isExisting(groupResizerSelector)).resolves.toBe(true);
      await page.dragAndDrop(groupResizerSelector, 50);
    })
  );

  test(
    'column resizer works within grouped table',
    setupTest(async page => {
      const resizerSelector = tableWrapper.findColumnResizer(3, { grouped: true }).toSelector();
      await expect(page.isExisting(resizerSelector)).resolves.toBe(true);
      await page.dragAndDrop(resizerSelector, 30);
    })
  );
});
