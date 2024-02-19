// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors/index.js';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

test(
  'allows tabbing into empty state button when keyboard navigation is active',
  useBrowser(async browser => {
    const wrapper = createWrapper().findTable();
    await browser.url('#/light/table/empty-state/?enableKeyboardNavigation=true');
    const page = new BasePageObject(browser);
    await page.waitForVisible(wrapper.findEmptySlot().findButton().toSelector());

    await page.click('#scroll-content');
    await page.keys(['Tab', 'Tab', 'Tab']);
    await page.isFocused(wrapper.findEmptySlot().findButton().toSelector());
  })
);
