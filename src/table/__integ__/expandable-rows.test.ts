// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import progressiveLoadingStyles from '../../../lib/components/table/progressive-loading/styles.selectors.js';

const tableWrapper = createWrapper().findTable();

interface TestPageOptions {
  useProgressiveLoading?: boolean;
  useServerMock?: boolean;
}

describe('Expandable rows', () => {
  const setupTest = (
    { useProgressiveLoading = false, useServerMock = false }: TestPageOptions,
    testFn: (page: BasePageObject) => Promise<void>
  ) => {
    return useBrowser(async browser => {
      const page = new BasePageObject(browser);
      await page.setWindowSize({ width: 1200, height: 1000 });
      const query = new URLSearchParams({
        useProgressiveLoading: String(useProgressiveLoading),
        useServerMock: String(useServerMock),
      });
      await browser.url(`#/light/table/expandable-rows-test?${query.toString()}`);
      await page.waitForVisible(tableWrapper.findBodyCell(2, 1).toSelector());
      await testFn(page);
    });
  };

  test(
    'expands and collapses item children by clicking on the expand toggle',
    setupTest({ useProgressiveLoading: false }, async page => {
      await expect(page.getElementsCount(tableWrapper.findRows().toSelector())).resolves.toBe(35);

      await page.click(tableWrapper.findExpandToggle(4).toSelector());
      await expect(page.getElementsCount(tableWrapper.findRows().toSelector())).resolves.toBe(35 + 3);

      await page.click(tableWrapper.findExpandToggle(4).toSelector());
      await expect(page.getElementsCount(tableWrapper.findRows().toSelector())).resolves.toBe(35);
    })
  );

  test(
    'uses items loader on the first expandable item',
    setupTest({ useProgressiveLoading: true, useServerMock: true }, async page => {
      const targetCluster = 'cluster-33387b6c';
      const loadingMessage = `Loading more items for ${targetCluster}`;
      // TODO: use public test utils method
      const targetClusterLoadMore = tableWrapper
        .find(`.${progressiveLoadingStyles['items-loader']}[data-parentrow="${targetCluster}"]`)
        .findButton();
      const page2Toggle = tableWrapper.findExpandToggle(4);
      const page3Toggle = tableWrapper.findExpandToggle(6);
      const getRowsCount = () => page.getElementsCount(tableWrapper.findRows().toSelector());

      // 10 data rows + 1 loader row
      await expect(getRowsCount()).resolves.toBe(10 + 1);

      // Expand target cluster
      await page.click(tableWrapper.findExpandToggle(1).toSelector());
      await page.waitForAssertion(() => expect(getRowsCount()).resolves.toBe(12 + 2));

      // Navigate to the target cluster loader
      await page.keys(['ArrowDown', 'ArrowDown', 'ArrowDown']);
      await expect(page.isFocused(targetClusterLoadMore.toSelector())).resolves.toBe(true);

      // Trigger target cluster load-more
      await page.keys(['Enter']);
      // Ensure state change occurs and the focus stays on the same cell (next load-more)
      await page.waitForAssertion(() => expect(page.getFocusedElementText()).resolves.toBe(loadingMessage));
      await page.waitForAssertion(() => expect(page.isFocused(page2Toggle.toSelector())).resolves.toBe(true));
      await page.waitForAssertion(() => expect(getRowsCount()).resolves.toBe(14 + 2));

      // Trigger subsequent loading
      await page.keys(['ArrowDown', 'ArrowDown', 'Enter']);
      // Ensure state change occurs and the focus stays on the same cell (last cluster's expand toggle)
      await page.waitForAssertion(() => expect(page.getFocusedElementText()).resolves.toBe(loadingMessage));
      await page.waitForAssertion(() => expect(page.isFocused(page3Toggle.toSelector())).resolves.toBe(true));
      await page.waitForAssertion(() => expect(getRowsCount()).resolves.toBe(15 + 1));
    })
  );
});
