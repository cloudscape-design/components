// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
const tableWrapper = createWrapper().findTable();
import styles from '../../../lib/components/table/styles.selectors.js';
import splitPanelStyles from '../../../lib/components/split-panel/styles.selectors.js';

const scrollbarSelector = `.${styles['sticky-scrollbar-visible']}`;

class StickyScrollbarPage extends BasePageObject {
  findVisibleScrollbar() {
    return tableWrapper.find(scrollbarSelector).toSelector();
  }
  findTable() {
    return tableWrapper.toSelector();
  }
}

const setupTest = (testFn: (page: StickyScrollbarPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new StickyScrollbarPage(browser);
    await page.setWindowSize({ width: 600, height: 400 });
    await browser.url('#/light/table/sticky-scrollbar');

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
  test(
    `scrollbarWidth is equal to tableWidth`,
    setupTest(async page => {
      const { width: scrollbarWidth } = await page.getBoundingBox(await page.findVisibleScrollbar());
      const { width: tableWidth } = await page.getBoundingBox(await page.findTable());
      expect(scrollbarWidth).toEqual(tableWidth);
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
    `is hidden, when table bottom is in view`,
    setupTest(async page => {
      await page.windowScrollTo({ top: 1000 });
      await page.waitForVisible(tableWrapper.findRows().toSelector());
      await expect(page.isExisting(await page.findVisibleScrollbar())).resolves.toEqual(false);
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

[false, true].forEach(visualRefresh =>
  describe(`visualRefresh=${visualRefresh}`, () => {
    test(
      'Table sticky scrollbar should not be shown when bottom is visible in split panel in page with footer',
      useBrowser(async browser => {
        const page = new BasePageObject(browser);
        await page.setWindowSize({ width: 1600, height: 400 });
        await browser.url(`#/light/app-layout/with-table-and-split-panel?visualRefresh=${visualRefresh}`);

        const wrapper = createWrapper();
        await page.click(wrapper.findSplitPanel().findOpenButton().toSelector());
        await page.click(wrapper.findSplitPanel().findPreferencesButton().toSelector());
        await page.click('label=Side');
        await page.click('button=Confirm');
        const { bottom } = await page.getBoundingBox(
          wrapper.find(`.${splitPanelStyles['content-side']}`).findTable().toSelector()
        );
        const { bottom: parentBottom } = await page.getBoundingBox(
          wrapper.find(`.${splitPanelStyles['content-side']}`).toSelector()
        );
        await page.elementScrollTo(wrapper.find(`.${splitPanelStyles['content-side']}`).toSelector(), {
          top: bottom - parentBottom + 15,
        });
        await expect(
          page.isExisting(await wrapper.find(`.${splitPanelStyles['content-side']} ${scrollbarSelector}`).toSelector())
        ).resolves.toEqual(false);
      })
    );
  })
);
