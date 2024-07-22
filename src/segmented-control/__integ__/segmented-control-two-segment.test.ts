// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const control = createWrapper().findSegmentedControl();

test(
  'allows to move focus using right arrow when segment to the right was last focused',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/segmented-control/two-segment?selectedId=seg-1');
    await page.waitForVisible(control.toSelector());

    // Focus seg-2
    await page.click('#focus-target');
    await page.keys(['Tab', 'ArrowRight']);
    await expect(page.isFocused(control.findSegments().get(2).toSelector())).resolves.toBe(true);

    // Focus seg-1
    await page.keys(['Tab', 'Tab']);

    // Focus seg-2
    await page.keys(['ArrowRight']);
    await expect(page.isFocused(control.findSegments().get(2).toSelector())).resolves.toBe(true);
  })
);

test(
  'allows to move focus using left arrow when segment to the left was last focused',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/segmented-control/two-segment?selectedId=seg-2');
    await page.waitForVisible(control.toSelector());

    // Focus seg-1
    await page.click('#focus-target');
    await page.keys(['Tab', 'ArrowLeft']);
    await expect(page.isFocused(control.findSegments().get(1).toSelector())).resolves.toBe(true);

    // Focus seg-2
    await page.keys(['Tab', 'Tab', 'Tab']);

    // Focus seg-1
    await page.keys(['ArrowLeft']);
    await expect(page.isFocused(control.findSegments().get(1).toSelector())).resolves.toBe(true);
  })
);
