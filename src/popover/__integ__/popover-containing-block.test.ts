// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

import styles from '../../../lib/components/popover/styles.selectors.js';

test(
  'Places popover under the trigger when it is inside container query with type "inline-size"',
  useBrowser(async browser => {
    const findPopover = (id: string) => createWrapper().findPopover(`[id="popover-${id}"]`);
    const popoverTrigger = (id: string) => findPopover(id).findTrigger().toSelector();
    const popoverDismiss = (id: string) => findPopover(id).findDismissButton().toSelector();
    const popoverArrow = (id: string) => findPopover(id).findByClassName(styles.arrow).toSelector();

    const page = new BasePageObject(browser);
    await browser.url('#/light/popover/scenario-in-container-query');
    await page.click(popoverTrigger('0'));

    const triggerRect0 = await page.getBoundingBox(popoverTrigger('0'));
    const contentRect0 = await page.getBoundingBox(popoverArrow('0'));
    expect(contentRect0.top - triggerRect0.bottom).toBeLessThanOrEqual(1);

    await page.click(popoverDismiss('0'));
    await page.click(popoverTrigger('1'));

    const triggerRect1 = await page.getBoundingBox(popoverTrigger('1'));
    const contentRect1 = await page.getBoundingBox(popoverArrow('1'));
    expect(contentRect1.top - triggerRect1.bottom).toBeLessThanOrEqual(1);
  })
);
