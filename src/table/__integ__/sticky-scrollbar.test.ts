// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
const tableWrapper = createWrapper().findTable();
import scrollbarStyles from '../../../lib/components/table/sticky-scrollbar/styles.selectors.js';

const scrollbarSelector = `.${scrollbarStyles['sticky-scrollbar-visible']}`;

class StickyScrollbarPage extends BasePageObject {
  findVisibleScrollbar() {
    return tableWrapper.find(scrollbarSelector).toSelector();
  }
  findTable() {
    return tableWrapper.toSelector();
  }
}

const setupTest = (testFn: (page: StickyScrollbarPage) => Promise<void>, isVisualRefresh?: boolean) => {
  return useBrowser(async browser => {
    const page = new StickyScrollbarPage(browser);
    await page.setWindowSize({ width: 600, height: 400 });
    await browser.url(
      `#/light/table/sticky-scrollbar?${isVisualRefresh ? 'visualRefresh=true' : 'visualRefresh=false'}`
    );

    await testFn(page);
  });
};

describe('Sticky scrollbar', () => {
  test(
    `is visible, when the table is in view, but it's bottom is not`,
    setupTest(async page => {
      await expect(page.isExisting(await page.findVisibleScrollbar())).resolves.toEqual(true);
    })
  );

  [false, true].forEach(visualRefresh =>
    describe(`visualRefresh=${visualRefresh}`, () => {
      test(
        `scrollbarWidth is equal to tableWidth`,
        setupTest(async page => {
          const { width: scrollbarWidth } = await page.getBoundingBox(await page.findVisibleScrollbar());
          const { width: tableWidth } = await page.getBoundingBox(await page.findTable());
          const borderOffset = visualRefresh ? 2 : 0;
          expect(scrollbarWidth).toEqual(tableWidth - borderOffset);
        }, visualRefresh)
      );
    })
  );

  test(
    `is hidden, when page is resized and table fits into the screen`,
    setupTest(async page => {
      await page.setWindowSize({ width: 1600, height: 400 });
      await expect(page.isExisting(await page.findVisibleScrollbar())).resolves.toEqual(false);
    })
  );
  test(
    `appears when screen is resized`,
    setupTest(async page => {
      await page.setWindowSize({ width: 1600, height: 400 });
      await expect(page.isExisting(await page.findVisibleScrollbar())).resolves.toEqual(false);
      await page.setWindowSize({ width: 600, height: 400 });
      await expect(page.isExisting(await page.findVisibleScrollbar())).resolves.toEqual(true);
    })
  );
  test(
    `scrollbar position updates when window resizes`,
    setupTest(async page => {
      await page.setWindowSize({ width: 600, height: 400 });
      const { bottom: bottom1 } = await page.getBoundingBox(page.findVisibleScrollbar());
      expect(bottom1).toEqual(400);
      await page.setWindowSize({ width: 600, height: 200 });
      const { bottom: bottom2 } = await page.getBoundingBox(page.findVisibleScrollbar());
      expect(bottom2).toEqual(200);
    })
  );
});
