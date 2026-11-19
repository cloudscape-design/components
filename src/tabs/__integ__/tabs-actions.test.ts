// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/tabs/actions');
    await page.waitForVisible(wrapper.findTabs().findTabContent().toSelector());
    await testFn(page);
  });
};

test(
  'tabs actions with popovers should be clickable',
  setupTest(async page => {
    for (let i = 1; i <= 3; i++) {
      await page.click(`[data-testid="popover${i}"]`);
      await expect(page.isDisplayed(wrapper.findPopover().toSelector())).resolves.toBe(true);
    }
  })
);
