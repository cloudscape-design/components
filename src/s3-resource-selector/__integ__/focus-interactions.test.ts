// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper().findS3ResourceSelector();
const uriInputSelector = wrapper.findInContext().findUriInput().findNativeInput().toSelector();
const browseButtonSelector = wrapper.findInContext().findBrowseButton().toSelector();
const tableFilteringInputSelector = wrapper.findTable().findTextFilter().findInput().findNativeInput().toSelector();
const firstBreadcrumbSelector = wrapper
  .findModal()
  .findContent()
  .findBreadcrumbGroup()
  .findBreadcrumbLink(1)
  .toSelector();

const getTableLinkSelector = (rowIndex: number) => wrapper.findTable().findBodyCell(rowIndex, 2).find('a').toSelector();

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url(`#/light/s3-resource-selector/main`);
    await page.waitForVisible(uriInputSelector);
    // set focus for deterministic tab navigation
    await page.click('#focus-start');
    await testFn(page);
  });
};

test(
  'Focus stays on the Uri input field after entering a path and fetching',
  setupTest(async page => {
    await page.keys(['Tab', 's3://bucket/object.html', 'Enter']);
    await expect(page.isFocused(uriInputSelector)).resolves.toBe(true);
  })
);

test(
  'Focus stays on Browse button after closing the modal',
  setupTest(async page => {
    // navigate to browse button and press it
    await page.keys(['Tab', 'Tab', 'Enter']);
    // dismiss the modal
    await page.keys(['Escape']);
    await expect(page.isFocused(browseButtonSelector)).resolves.toBe(true);
  })
);

test(
  'Focus jumps to the filtering input after navigating via breadcrumbs',
  setupTest(async page => {
    await page.click(browseButtonSelector);
    await expect(page.isFocused(wrapper.findModal().findDismissButton().toSelector())).resolves.toBe(true);
    await page.click(getTableLinkSelector(1));
    await expect(page.isFocused(tableFilteringInputSelector)).resolves.toBe(true);
    await page.click(firstBreadcrumbSelector);
    await expect(page.isFocused(tableFilteringInputSelector)).resolves.toBe(true);
  })
);

test(
  'Focus jumps to the Uri input after submitting the modal',
  setupTest(async page => {
    await page.click(browseButtonSelector);
    await page.click(getTableLinkSelector(1));
    await page.setValue(tableFilteringInputSelector, 'wave-function-4ns.sim');
    await page.click(wrapper.findTable().findRowSelectionArea(1).toSelector());
    // navigate to submit button using keyboard
    await page.keys(['Tab', 'Tab', 'Enter']);

    await expect(page.isDisplayed(wrapper.findModal().toSelector())).resolves.toBe(false);
    await expect(page.isFocused(uriInputSelector)).resolves.toBe(true);
  })
);
