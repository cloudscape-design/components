// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();

class TogglePage extends BasePageObject {}

const setupTest = (testFn: (page: TogglePage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new TogglePage(browser);
    await browser.url('#/light/toggle/simple');
    await testFn(page);
  });
};

test(
  'Clicking on form field label should not change toggle state',
  setupTest(async page => {
    await page.click(wrapper.findFormField().findLabel().toSelector());
    await expect(
      page.isSelected(wrapper.find('#formfield-with-toggle').findToggle().find('input').toSelector())
    ).resolves.toBe(false);
  })
);
