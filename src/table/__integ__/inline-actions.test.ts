// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper, { TableWrapper } from '../../../lib/components/test-utils/selectors/index.js';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import styles from '../../../lib/components/table/styles.selectors.js';

const tableWithDropdownActions = createWrapper().findTable('[data-testid="table-with-dropdown-actions"]')!;

function getTableContainerSelector(tableWrapper: TableWrapper) {
  return tableWrapper.findByClassName(styles.wrapper);
}

interface TestOptions {
  enableKeyboardNavigation?: boolean;
  stickyActions?: boolean;
}

const setupTest = (
  { enableKeyboardNavigation = false, stickyActions = false }: TestOptions,
  testFn: (page: BasePageObject) => Promise<void>
) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await page.setWindowSize({ width: 1200, height: 800 });
    const query = new URLSearchParams({
      enableKeyboardNavigation: String(enableKeyboardNavigation),
      stickyActions: String(stickyActions),
    });
    await browser.url(`#/light/table/inline-actions?${query.toString()}`);
    await testFn(page);
  });
};

test(
  'dropdown actions in a sticky column do not cause table scroll to the right',
  setupTest({ stickyActions: true }, async page => {
    const tableContainer = getTableContainerSelector(tableWithDropdownActions);
    const actionsDropdown = tableWithDropdownActions.findBodyCell(1, 6).findButtonDropdown();

    await page.setWindowSize({ width: 600, height: 2000 });
    await expect(page.getElementScroll(tableContainer.toSelector())).resolves.toEqual({ top: 0, left: 0 });

    await page.click(actionsDropdown.toSelector());
    await page.click(actionsDropdown.findItemById('connect').toSelector());
    await expect(page.getElementScroll(tableContainer.toSelector())).resolves.toEqual({ top: 0, left: 0 });
  })
);
