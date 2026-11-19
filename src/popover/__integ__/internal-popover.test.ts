// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/popover/internal-test');
    await testFn(page);
  });
};

const wrapper = createWrapper().findPopover();
const selectWrapper = wrapper.findContent().findSelect();
const selectDropdown = selectWrapper.findDropdown({ expandToViewport: true });

test(
  'Click inside nested portal do not issue popover dismissal',
  setupTest(async page => {
    await page.click(wrapper.findTrigger().toSelector());
    await page.click(selectWrapper.findTrigger().toSelector());
    await page.click(selectDropdown.findOption(10).toSelector());
    await expect(page.isDisplayed(wrapper.findContent({ renderWithPortal: false }).toSelector())).resolves.toBe(true);
  })
);

test(
  'Dropdown inside can grow past the popover',
  setupTest(async page => {
    await page.click(wrapper.findTrigger().toSelector());
    await page.click(selectWrapper.findTrigger().toSelector());
    const dropdownBottom = (await page.getBoundingBox(selectDropdown.findOpenDropdown().toSelector())).bottom;
    const popoverBottom = (await page.getBoundingBox(wrapper.findContent().toSelector())).bottom;
    expect(dropdownBottom).toBeGreaterThan(popoverBottom);
  })
);
