// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const checkboxWrapper = createWrapper().findCheckbox();

class CheckboxPage extends BasePageObject {}

const setupTest = (testFn: (page: CheckboxPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new CheckboxPage(browser);
    await browser.url('#/light/checkbox/labels-highlight');
    await testFn(page);
  });
};

test(
  'label should not stretch to the entire container width',
  setupTest(async page => {
    const { width: elementWidth } = await page.getBoundingBox(checkboxWrapper.toSelector());
    const { width: labelWidth } = await page.getBoundingBox(checkboxWrapper.findLabel().toSelector());
    expect(labelWidth).toBeLessThan(elementWidth);
  })
);
