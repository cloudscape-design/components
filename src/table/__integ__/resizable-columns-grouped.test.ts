// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const tableWrapper = createWrapper().findTable();
const defaultScreen = { width: 1680, height: 800 };

class GroupedTablePage extends BasePageObject {
  async getGroupHeaderWidth(index: number) {
    const selector = `${tableWrapper.toSelector()} thead th[scope="colgroup"]:nth-of-type(${index})`;
    const el = await this.browser.$(selector);
    const size = await el.getSize();
    return size.width;
  }

  async resizeGroupHeader(index: number, xOffset: number) {
    const groupCells = await this.browser.$$(`${tableWrapper.toSelector()} thead th[scope="colgroup"]`);
    const cell = groupCells[index];
    const resizer = await cell.$('button');
    const resizerSelector =
      (await resizer.getSelector?.()) ??
      `${tableWrapper.toSelector()} thead th[scope="colgroup"]:nth-child(${index + 1}) button`;
    await this.dragAndDrop(resizerSelector, xOffset);
  }
}

const setupTest = (testFn: (page: GroupedTablePage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new GroupedTablePage(browser);
    await browser.url('#/light/table/column-groups');
    await page.setWindowSize(defaultScreen);
    await testFn(page);
  });
};

describe('Table - Grouped column resizing', () => {
  test(
    'group resizer changes group width on drag',
    setupTest(async page => {
      // Enable resizable columns (it's on by default in the test page)
      const thead = `${tableWrapper.toSelector()} thead`;
      const groupCells = await page.browser.$$(`${thead} th[scope="colgroup"]`);
      expect(groupCells.length).toBeGreaterThan(0);

      // Get initial width of first group
      const firstGroupCell = groupCells[0];
      const initialSize = await firstGroupCell.getSize();
      const initialWidth = initialSize.width;

      // Find and drag the group resizer
      const resizer = await firstGroupCell.$('button');
      if (resizer) {
        await page.dragAndDrop((await resizer.getSelector?.()) ?? `${thead} th[scope="colgroup"] button`, 50);
      }

      // Width should have changed
      const newSize = await firstGroupCell.getSize();
      expect(newSize.width).not.toBe(initialWidth);
    })
  );

  test(
    'leaf column resizer works within grouped table',
    setupTest(async page => {
      const resizer = tableWrapper.findColumnResizer(3);
      const resizerSelector = resizer.toSelector();

      // Verify resizer exists
      await expect(page.isExisting(resizerSelector)).resolves.toBe(true);

      // Drag to resize
      await page.dragAndDrop(resizerSelector, 30);

      // No error — resize completed
    })
  );
});
