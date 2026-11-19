// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import A11yPageObject from '../../__a11y__/a11y-page-object';

const wrapper = createWrapper().findPropertyFilter();
const popoverWrapper = createWrapper(wrapper.findTokens().get(1).toSelector()).findPopover();

function setupTest(testFn: (page: A11yPageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new A11yPageObject(browser);
    await browser.url('#/light/property-filter/async-loading.integ?token=property');
    await page.waitForVisible('main');
    await testFn(page);
  });
}

test(
  'property filter token editor has no axe violations',
  setupTest(async page => {
    await page.click(popoverWrapper.findTrigger().toSelector());
    await page.assertNoAxeViolations();
  })
);
