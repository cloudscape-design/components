// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

import styles from '../../../lib/components/table/styles.selectors.js';

test(
  'does not cause table wrapper to scroll when clicking on an interactive element inside a sticky column',
  useBrowser(async browser => {
    const tableWrapper = createWrapper().findTable('[data-test-id="small-table"]');
    const wrapperSelector = tableWrapper.findAllByClassName(styles.wrapper).toSelector();
    await browser.setWindowSize(600, 1000);
    await browser.url('#/light/table/sticky-columns/?selectionType=multi&stickyColumnsFirst=1&stickyColumnsLast=1');
    const page = new BasePageObject(browser);
    await page.waitForVisible(tableWrapper.findRows().toSelector());

    await page.elementScrollTo(wrapperSelector, { top: 0, left: 100 });
    await expect(page.getElementScroll(wrapperSelector)).resolves.toEqual({ top: 0, left: 100 });

    await page.click(tableWrapper.findRowSelectionArea(1).toSelector());
    await page.pause(100);
    await expect(page.getElementScroll(wrapperSelector)).resolves.toEqual({ top: 0, left: 100 });
  })
);
