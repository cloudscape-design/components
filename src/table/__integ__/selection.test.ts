// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';

const tableWrapper = createWrapper().findTable();

class TablePage extends BasePageObject {
  async selectFirstRow() {
    await this.click(tableWrapper.findRowSelectionArea(1).toSelector());
  }

  async selectLastRow() {
    const rowCount = await this.getElementsCount(tableWrapper.findRows().toSelector());
    await this.click(tableWrapper.findRowSelectionArea(rowCount).toSelector());
  }

  async selectAll() {
    await this.click(tableWrapper.findSelectAllTrigger().toSelector());
  }

  async getTableHeight() {
    const { height } = await this.getBoundingBox(tableWrapper.toSelector());
    return height;
  }
}

describe('Selection has no effect on table height', () => {
  const setupTest = (testFn: (page: TablePage) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new TablePage(browser);
      await browser.url('#/light/table/shift-selection');
      await page.waitForVisible(tableWrapper.findBodyCell(2, 1).toSelector());
      await testFn(page);
    });
  };

  test(
    'select last row does not change table height',
    setupTest(async page => {
      const heightNoSelection = await page.getTableHeight();
      await page.selectLastRow();
      const heightWithLastRowSelected = await page.getTableHeight();
      await expect(heightWithLastRowSelected).toBe(heightNoSelection);
    })
  );

  test(
    'select first row does not change table height',
    setupTest(async page => {
      const heightNoSelection = await page.getTableHeight();
      await page.selectFirstRow();
      const heightWithLastRowSelected = await page.getTableHeight();
      await expect(heightWithLastRowSelected).toBe(heightNoSelection);
    })
  );

  test(
    'select first and last row does not change table height',
    setupTest(async page => {
      const heightNoSelection = await page.getTableHeight();
      await page.selectFirstRow();
      await page.selectLastRow();
      const heightWithLastRowSelected = await page.getTableHeight();
      await expect(heightWithLastRowSelected).toBe(heightNoSelection);
    })
  );

  test(
    'select all rows not change table height',
    setupTest(async page => {
      const heightNoSelection = await page.getTableHeight();
      await page.selectAll();
      const heightWithLastRowSelected = await page.getTableHeight();
      await expect(heightWithLastRowSelected).toBe(heightNoSelection);
    })
  );
});
