// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import styles from '../../../lib/components/table/styles.selectors.js';
import selectionStyles from '../../../lib/components/table/selection-control/styles.selectors.js';

const tableWrapper = createWrapper().findTable();
const tableScrollWrapper = tableWrapper.findByClassName(styles.wrapper);
const headerSecondary = tableWrapper.findByClassName(styles['header-secondary']);
const originalTableHeader = tableScrollWrapper.find('thead');
const scrollContainerSelector = '#scroll-container';
const scrollToTopSelector = '#scroll-to-top';
const toggleStickySelector = '#toggle-sticky';
const togglePaginationSelector = '#toggle-pagination';
const setStickyOffsetSelector = '#set-sticky-offset';

class StickyHeaderPage extends BasePageObject {
  getElementSizes(selector: string) {
    return this.browser.execute((selector: string) => {
      const elements = Array.prototype.slice.apply(document.querySelectorAll(selector));
      return elements
        .map(element => element.getBoundingClientRect())
        .map(rect => ({
          width: Math.round(rect.offsetWidth),
        }));
    }, selector);
  }

  findTable() {
    return tableWrapper.toSelector();
  }

  findTableHiddenSelectAllTrigger() {
    return tableWrapper.find(`.${styles.wrapper} .${selectionStyles.root} input`);
  }
}

const desktopSize = { width: 900, height: 800 };
const mobileSize = { ...desktopSize, width: 600 };

const setupTest = (testFn: (page: StickyHeaderPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new StickyHeaderPage(browser);
    await page.setWindowSize(desktopSize);
    await browser.url('#/light/table/sticky-header-scrollable-container');
    await testFn(page);
  });
};

describe('Sticky header', () => {
  test(
    `syncs column sizes from the hidden column headers`,
    setupTest(async page => {
      const originalWidths = await page.getElementSizes(originalTableHeader.findAll('tr > *').toSelector());
      const copyWidths = await page.getElementSizes(tableWrapper.findColumnHeaders().toSelector());
      expect(copyWidths).toEqual(originalWidths);
    })
  );

  test(
    `syncs column sizes from the hidden column headers when items change`,
    useBrowser(async browser => {
      const page = new StickyHeaderPage(browser);
      await browser.url('#/light/table/hooks');
      await page.click(tableWrapper.findPagination().findPageNumberByIndex(2).toSelector());
      const originalWidths = await page.getElementSizes(originalTableHeader.findAll('tr > *').toSelector());
      const copyWidths = await page.getElementSizes(tableWrapper.findColumnHeaders().toSelector());
      expect(copyWidths).toEqual(originalWidths);
    })
  );

  test(
    `scrolls the scroll parent, to reveal focused row`,
    setupTest(async page => {
      await page.elementScrollTo(scrollContainerSelector, { top: 200 });
      await page.click(tableWrapper.findSelectAllTrigger().find('input').toSelector());
      await page.keys(['ArrowDown']);
      const { top: scrollTop } = await page.getElementScroll(scrollContainerSelector);
      expect(scrollTop).toBeLessThan(200);
    })
  );
  test(
    `scrollToTop scrolls the scroll parent to reveal the first row`,
    setupTest(async page => {
      await page.elementScrollTo(scrollContainerSelector, { top: 200 });
      await page.click(scrollToTopSelector);
      const { top: scrollTop } = await page.getElementScroll(scrollContainerSelector);
      expect(scrollTop).toBeLessThan(200);
    })
  );
  test(
    `scrollToTop does not do anything, when stickyScrollbar is set to 'false'`,
    setupTest(async page => {
      await page.click(toggleStickySelector);
      await page.elementScrollTo(scrollContainerSelector, { top: 200 });
      await page.click(scrollToTopSelector);
      const { top: scrollTop } = await page.getElementScroll(scrollContainerSelector);
      expect(scrollTop).toEqual(200);
    })
  );
  test(
    `respects top offset passed in a property`,
    setupTest(async page => {
      await page.elementScrollTo(scrollContainerSelector, { top: 200 });
      const { top: headerTopBefore } = await page.getBoundingBox(tableWrapper.findHeaderSlot().toSelector());
      await page.click(setStickyOffsetSelector);
      const { top: headerTopAfter } = await page.getBoundingBox(tableWrapper.findHeaderSlot().toSelector());
      expect(headerTopAfter - headerTopBefore).toEqual(50);
    })
  );
  test(
    `syncs column header copies scroll with the table`,
    setupTest(async page => {
      await page.elementScrollTo(tableScrollWrapper.toSelector(), { left: 50 });
      await page.waitForJsTimers();
      const { left: scrollLeft } = await page.getElementScroll(headerSecondary.toSelector());
      expect(scrollLeft).toEqual(50);
    })
  );
  test(
    `does not affect tab order`,
    setupTest(async page => {
      await page.click(togglePaginationSelector);
      await page.click(tableWrapper.findTextFilter().findInput().toSelector());
      // skip preferences toggle and table scrollable region
      await page.keys(['Tab', 'Tab', 'Tab']);
      // find the hidden table select checkbox
      await expect(page.isFocused(page.findTableHiddenSelectAllTrigger().getElement())).resolves.toBeTruthy();
      // column headers
      for (const column of ['ID', 'Type', 'DNS name', 'Image ID', 'State']) {
        await page.keys('Tab');
        await expect(page.getFocusedElementText()).resolves.toBe(column);
      }
      await page.keys('Tab');
      // first row selection checkbox
      await expect(
        page.isFocused(tableWrapper.findRowSelectionArea(1).find('input').toSelector())
      ).resolves.toBeTruthy();
    })
  );
  test(
    `scrollToTop is called in collection hooks, whenever pagination, filtering and sorting is updated`,
    setupTest(async page => {
      await page.elementScrollTo(scrollContainerSelector, { top: 200 });
      await page.click(tableWrapper.findPagination().findNextPageButton().toSelector());
      expect((await page.getElementScroll(scrollContainerSelector)).top).toBeLessThan(200);
      await page.elementScrollTo(scrollContainerSelector, { top: 200 });
      await page.click(tableWrapper.findTextFilter().findInput().toSelector());
      await page.keys('a');
      expect((await page.getElementScroll(scrollContainerSelector)).top).toBeLessThan(200);
      await page.elementScrollTo(scrollContainerSelector, { top: 200 });
      await page.click(tableWrapper.findColumnHeaders().get(2).toSelector());
      expect((await page.getElementScroll(scrollContainerSelector)).top).toBeLessThan(200);
    })
  );

  test(
    'sticky header does not get stuck on mobile but table header row does',
    setupTest(async page => {
      await page.setWindowSize(mobileSize);
      await page.elementScrollTo(scrollContainerSelector, { top: 200 });
      const { top: headerOldOffset } = await page.getBoundingBox(tableWrapper.findHeaderSlot().toSelector());
      await page.elementScrollTo(scrollContainerSelector, { top: 400 });
      const { top: headerNewOffset } = await page.getBoundingBox(tableWrapper.findHeaderSlot().toSelector());
      expect(headerOldOffset).not.toEqual(headerNewOffset);

      const { top: tableHeaderRowOldOffset } = await page.getBoundingBox(headerSecondary.toSelector());
      await page.elementScrollTo(scrollContainerSelector, { top: 600 });
      const { top: tableHeaderRowNewOffset } = await page.getBoundingBox(headerSecondary.toSelector());
      expect(tableHeaderRowOldOffset).toEqual(tableHeaderRowNewOffset);
    })
  );

  test(
    'sticky feature is enabled on desktop',
    setupTest(async page => {
      await page.elementScrollTo(scrollContainerSelector, { top: 200 });
      const { top: oldOffset } = await page.getBoundingBox(tableWrapper.findHeaderSlot().toSelector());
      await page.elementScrollTo(scrollContainerSelector, { top: 400 });
      const { top: newOffset } = await page.getBoundingBox(tableWrapper.findHeaderSlot().toSelector());
      expect(oldOffset).toEqual(newOffset);
    })
  );

  describe('responsive behaviors', () => {
    [
      { screenSize: desktopSize, name: 'desktop' },
      { screenSize: mobileSize, name: 'mobile' },
    ].forEach(({ screenSize, name }) => {
      test(
        `sorting works on ${name}`,
        setupTest(async page => {
          await page.setWindowSize(screenSize);
          const oldItem = await page.getText(tableWrapper.findBodyCell(1, 2).toSelector());
          await page.click(tableWrapper.findColumnHeaders().get(2).toSelector());
          const newItem = await page.getText(tableWrapper.findBodyCell(1, 2).toSelector());
          expect(oldItem).not.toEqual(newItem);
        })
      );
    });
  });
});
