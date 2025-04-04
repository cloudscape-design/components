// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject, ElementRect } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

import styles from '../../../lib/components/popover/styles.selectors.js';

[false, true].forEach(renderWithPortal =>
  test.each(['x1', 'x2', 'x3', 'x4', 'x5', 'x6'])(
    `Places popover correctly for containing block scenario = %s, renderWithPortal=${renderWithPortal}`,
    async id => {
      await useBrowser(async browser => {
        const popoverTriggerSelector = createWrapper().findPopover(`#${id}`).findTrigger().toSelector();
        const popoverArrowSelector = createWrapper().findByClassName(styles.arrow).toSelector();

        const page = new BasePageObject(browser);
        await browser.url(`#/light/popover/containing-block-test?renderWithPortal=${renderWithPortal}`);
        await page.click(popoverTriggerSelector);

        const triggerRect = await page.getBoundingBox(popoverTriggerSelector);
        const arrowRect = await page.getBoundingBox(popoverArrowSelector);
        expect(Math.abs(triggerRect.bottom - arrowRect.top)).toBeLessThan(1);
        expect(Math.abs(getCenter(triggerRect) - getCenter(arrowRect))).toBeLessThan(1);
      })();
    }
  )
);

function getCenter(rect: ElementRect) {
  return rect.left + rect.width / 2;
}
