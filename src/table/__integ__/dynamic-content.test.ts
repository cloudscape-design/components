// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors/index.js';

const tableWrapper = createWrapper().findTable();

class TablePage extends BasePageObject {
  async getColumnWidth(columnIndex: number) {
    const columnSelector = tableWrapper.findColumnHeaders().get(columnIndex).toSelector();
    const element = await this.browser.$(columnSelector);
    const size = await element.getSize();
    return size.width;
  }
}

test(
  'something',
  useBrowser(async browser => {
    await browser.url('#/light/table/dynamic-content');
    const page = new TablePage(browser);

    await page.waitForVisible(tableWrapper.findColumnHeaders().toSelector());

    await expect(page.getColumnWidth(3)).resolves.toBeLessThan(350);

    await page.waitForJsTimers(2000);

    await expect(page.getColumnWidth(3)).resolves.toBeGreaterThan(400);
  })
);
