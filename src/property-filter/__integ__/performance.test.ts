// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

const wrapper = createWrapper().findPropertyFilter();

function setupTest(testFn: (page: BasePageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/property-filter/performance');
    await page.waitForVisible(wrapper.toSelector());
    await testFn(page);
  });
}

test(
  'ensures no console errors when filtering',
  setupTest(async page => {
    await page.click(wrapper.findNativeInput().toSelector());
    await page.keys('i-');
  })
);
