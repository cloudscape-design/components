// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const tableWrapper = createWrapper().findTable();

class TablePage extends BasePageObject {
  async resizeColumn(columnIndex: number, xOffset: number) {
    const resizerSelector = tableWrapper.findColumnResizer(columnIndex).toSelector();
    await this.dragAndDrop(resizerSelector, xOffset);
  }

  async getColumnWidth(columnIndex: number) {
    const columnSelector = tableWrapper.findColumnHeaders().get(columnIndex).toSelector();
    const element = await this.browser.$(columnSelector);
    const size = await element.getSize();
    return size.width;
  }
}

const setupTest = (testFn: (page: TablePage) => Promise<void>) => {
  return useBrowser({ width: 1600, height: 800 }, async browser => {
    const page = new TablePage(browser);
    await browser.url('#/light/table/with-iframe');
    await page.runInsideIframe('#inner-iframe', true, async () => {
      await page.waitForVisible(tableWrapper.findBodyCell(2, 1).toSelector());
    });
    await testFn(page);
  });
};

test(
  'should expand and shrink a column correctly',
  setupTest(async page => {
    await page.runInsideIframe('#inner-iframe', true, async () => {
      const delta = 50;
      let prevWidth = await page.getColumnWidth(2);
      await page.resizeColumn(2, delta);
      let width = await page.getColumnWidth(2);
      expect(width).toBe(prevWidth + delta);
      prevWidth = width;
      await page.resizeColumn(2, -delta);
      width = await page.getColumnWidth(2);
      expect(width).toBe(prevWidth - delta);
    });
  })
);
