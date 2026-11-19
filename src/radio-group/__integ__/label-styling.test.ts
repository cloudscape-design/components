// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const radioGroupWrapper = createWrapper().findRadioGroup();

class RadioPage extends BasePageObject {}

const setupTest = (testFn: (page: RadioPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new RadioPage(browser);
    await browser.url('#/light/radio-group/labels-highlight');
    await page.waitForVisible(radioGroupWrapper.findButtons().toSelector());
    await testFn(page);
  });
};

test(
  'label should not stretch to the entire container width',
  setupTest(async page => {
    const radioButtonWrapper = radioGroupWrapper.findButtons().get(1);
    const { width: elementWidth } = await page.getBoundingBox(radioButtonWrapper.toSelector());
    const { width: labelWidth } = await page.getBoundingBox(radioButtonWrapper.findLabel().toSelector());
    expect(labelWidth).toBeLessThan(elementWidth);
  })
);
