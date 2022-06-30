// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();

describe('focus-visible', () => {
  const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new BasePageObject(browser);
      await browser.url('#/light/focus-visible');
      await page.waitForVisible(wrapper.findButton().toSelector());
      await testFn(page);
    });
  };

  test(
    'click on the button does not set the focus-ring',
    setupTest(async page => {
      await page.click('#first-button');
      await expect(page.getElementAttribute('#first-button', 'data-awsui-focus-visible')).resolves.toBeNull();
    })
  );
});
