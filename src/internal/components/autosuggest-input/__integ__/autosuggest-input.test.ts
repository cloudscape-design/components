// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import AutosuggestInputWrapper from '../../../../../lib/components/test-utils/selectors/internal/autosuggest-input';

const wrapper = new AutosuggestInputWrapper('*');

function setupTest(testFn: (page: BasePageObject) => Promise<void>, url = '/#/light/autosuggest/autosuggest-input') {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url(url);
    await testFn(page);
  });
}

test(
  'should replace dropdown content and change its size',
  setupTest(async page => {
    await page.click(wrapper.findInput().findNativeInput().toSelector());
    await page.waitForVisible(wrapper.findDropdown()!.findOpenDropdown().toSelector());
    const smallDropdownSize = await page.getBoundingBox(wrapper.findDropdown()!.findOpenDropdown().toSelector());

    await page.keys('Medium');
    await page.waitForVisible(wrapper.findDropdown()!.findOpenDropdown().toSelector());
    const mediumDropdownSize = await page.getBoundingBox(wrapper.findDropdown()!.findOpenDropdown().toSelector());

    expect(smallDropdownSize).not.toEqual(mediumDropdownSize);
  })
);
