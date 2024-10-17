// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

import scrollbarStyles from '../../../lib/components/table/sticky-scrollbar/styles.selectors.js';

const scrollbarSelector = `.${scrollbarStyles['sticky-scrollbar-visible']}`;

const tableWrapper = createWrapper().findTable();
const containerWrapper = createWrapper().findContainer();
const scrollbarWrapper = tableWrapper.find(scrollbarSelector);

const setupTest = (testFn: (page: BasePageObject) => Promise<void>, isVisualRefresh?: boolean) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
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
      await expect(page.isExisting(scrollbarWrapper.toSelector())).resolves.toEqual(true);
    })
  );

  [false, true].forEach(visualRefresh =>
    describe(`visualRefresh=${visualRefresh}`, () => {
      test(
        'scrollbarWidth is equal to tableWidth',
        setupTest(async page => {
          const { width: scrollbarWidth } = await page.getBoundingBox(scrollbarWrapper.toSelector());
          const { width: tableWidth } = await page.getBoundingBox(tableWrapper.toSelector());
          const borderOffset = visualRefresh ? 2 : 0;
          expect(scrollbarWidth).toEqual(tableWidth - borderOffset);
        }, visualRefresh)
      );

      test(
        'sticky scrollbar is at the bottom when rendered inside container with fit-height',
        useBrowser(async browser => {
          const page = new BasePageObject(browser);
          await browser.url(
            `#/light/table/sticky-scrollbar-in-container?visualRefresh=${visualRefresh}&fitHeight=true`
          );
          const { bottom: containerBottom } = await page.getBoundingBox(containerWrapper.findContent().toSelector());
          const { bottom: scrollbarBottom } = await page.getBoundingBox(scrollbarWrapper.toSelector());
          expect(scrollbarBottom).toBe(containerBottom);
        })
      );
    })
  );

  test(
    'is hidden, when page is resized and table fits into the screen',
    setupTest(async page => {
      await page.setWindowSize({ width: 1600, height: 400 });
      await expect(page.isExisting(scrollbarWrapper.toSelector())).resolves.toEqual(false);
    })
  );
  test(
    'appears when screen is resized',
    setupTest(async page => {
      await page.setWindowSize({ width: 1600, height: 400 });
      await expect(page.isExisting(scrollbarWrapper.toSelector())).resolves.toEqual(false);
      await page.setWindowSize({ width: 600, height: 400 });
      await expect(page.isExisting(scrollbarWrapper.toSelector())).resolves.toEqual(true);
    })
  );
  test(
    'scrollbar position updates when window resizes',
    setupTest(async page => {
      await page.setWindowSize({ width: 600, height: 600 });
      const { bottom: bottom1 } = await page.getBoundingBox(scrollbarWrapper.toSelector());
      expect(bottom1).toEqual((await page.getViewportSize()).height);

      await page.setWindowSize({ width: 600, height: 400 });
      const { bottom: bottom2 } = await page.getBoundingBox(scrollbarWrapper.toSelector());
      expect(bottom1 - bottom2).toBe(200);
    })
  );
});
