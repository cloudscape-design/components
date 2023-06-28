// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import headerCellStyles from '../../../lib/components/table/header-cell/styles.selectors.js';

const wrapper = createWrapper().findTable();
const preferences = wrapper.findCollectionPreferences();

test(
  'changes page size on confirm',
  useBrowser(async browser => {
    await browser.url('#/light/table/hooks');
    const page = new BasePageObject(browser);
    await page.waitForVisible(wrapper.findRows().toSelector());
    await expect(page.getElementsCount(wrapper.findRows().toSelector())).resolves.toEqual(20);

    await page.click(preferences.findTriggerButton().toSelector());
    await page.waitForVisible(preferences.findModal().toSelector());
    await page.click(
      preferences.findModal().findPageSizePreference().findOptions().get(2).findNativeInput().toSelector()
    );
    await page.click(preferences.findModal().findConfirmButton().toSelector());
    await expect(page.getElementsCount(wrapper.findRows().toSelector())).resolves.toEqual(50);
  })
);
test(
  'does not change page size on cancel',
  useBrowser(async browser => {
    await browser.url('#/light/table/hooks');
    const page = new BasePageObject(browser);
    await page.waitForVisible(wrapper.findRows().toSelector());
    await expect(page.getElementsCount(wrapper.findRows().toSelector())).resolves.toEqual(20);

    await page.click(preferences.findTriggerButton().toSelector());
    await page.waitForVisible(preferences.findModal().toSelector());
    await page.click(
      preferences.findModal().findPageSizePreference().findOptions().get(2).findNativeInput().toSelector()
    );
    await page.click(preferences.findModal().findCancelButton().toSelector());
    await expect(page.getElementsCount(wrapper.findRows().toSelector())).resolves.toEqual(20);
  })
);
test(
  'changes column visibility using the visibleColumn property',
  useBrowser(async browser => {
    await browser.url('#/light/table/visible-content');
    const page = new BasePageObject(browser);
    await page.waitForVisible(wrapper.findRows().toSelector());
    await expect(
      page.getElementsText(wrapper.findColumnHeaders().find(`.${headerCellStyles['header-cell-content']}`).toSelector())
    ).resolves.toEqual(['ID', 'Type', 'DNS name', 'State']);

    await page.click(preferences.findTriggerButton().toSelector());
    await page.waitForVisible(preferences.findModal().toSelector());
    await page.click(preferences.findModal().findVisibleContentPreference().findToggleByIndex(1, 2).toSelector());
    await page.click(preferences.findModal().findVisibleContentPreference().findToggleByIndex(1, 3).toSelector());
    await page.click(preferences.findModal().findVisibleContentPreference().findToggleByIndex(1, 4).toSelector());
    await page.click(preferences.findModal().findConfirmButton().toSelector());
    await expect(
      page.getElementsText(wrapper.findColumnHeaders().find(`.${headerCellStyles['header-cell-content']}`).toSelector())
    ).resolves.toEqual(['ID', 'Image ID', 'State']);
  })
);
test(
  'changes column visibility using the columnDisplay property',
  useBrowser(async browser => {
    await browser.url('#/light/table/hooks');
    const page = new BasePageObject(browser);
    await page.waitForVisible(wrapper.findRows().toSelector());
    await expect(
      page.getElementsText(wrapper.findColumnHeaders().find(`.${headerCellStyles['header-cell-content']}`).toSelector())
    ).resolves.toEqual(['ID', 'Type', 'DNS name', 'State']);

    await page.click(preferences.findTriggerButton().toSelector());
    const modal = preferences.findModal();
    await page.waitForVisible(modal.toSelector());
    const options = modal.findContentDisplayPreference().findOptions();
    await page.click(options.get(2).toSelector());
    await page.click(options.get(3).toSelector());
    await page.click(options.get(4).toSelector());
    await page.click(modal.findConfirmButton().toSelector());
    await expect(
      page.getElementsText(wrapper.findColumnHeaders().find(`.${headerCellStyles['header-cell-content']}`).toSelector())
    ).resolves.toEqual(['ID', 'Image ID', 'State']);
  })
);
test(
  'changes column order',
  useBrowser(async browser => {
    await browser.url('#/light/table/hooks');
    const page = new BasePageObject(browser);
    await page.waitForVisible(wrapper.findRows().toSelector());
    await expect(
      page.getElementsText(wrapper.findColumnHeaders().find(`.${headerCellStyles['header-cell-content']}`).toSelector())
    ).resolves.toEqual(['ID', 'Type', 'DNS name', 'State']);

    await page.click(preferences.findTriggerButton().toSelector());
    const modal = preferences.findModal();
    await page.waitForVisible(modal.toSelector());
    // Focus the drag handle of the second item
    await page.keys(new Array(4).fill('Tab'));
    // Swap the second item with the third one
    await page.keys('Space');
    await page.keys('ArrowDown');
    await page.keys('Space');
    await page.click(modal.findConfirmButton().toSelector());
    await expect(
      page.getElementsText(wrapper.findColumnHeaders().find(`.${headerCellStyles['header-cell-content']}`).toSelector())
    ).resolves.toEqual(['ID', 'DNS name', 'Type', 'State']);
  })
);
