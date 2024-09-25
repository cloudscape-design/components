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

const setupTest = (
  testFn: (page: TablePage, switchToIframe: (callback: () => Promise<void>) => Promise<void>) => Promise<void>
) => {
  return useBrowser({ width: 1600, height: 800 }, async browser => {
    const page = new TablePage(browser);
    const switchToIframe = async (callback: () => Promise<void>) => {
      const iframeEl = await browser.$('#inner-iframe');
      await browser.switchToFrame(iframeEl);
      await callback();
      await browser.switchToFrame(null);
    };
    await browser.url('#/light/table/with-iframe');
    await switchToIframe(async () => {
      await page.waitForVisible(tableWrapper.findBodyCell(2, 1).toSelector());
    });
    await testFn(page, switchToIframe);
  });
};

test(
  'should expand and shrink a column correctly',
  setupTest(async (page, switchToIframe) => {
    await switchToIframe(async () => {
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
