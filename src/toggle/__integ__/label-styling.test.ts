// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const toggleWrapper = createWrapper().findToggle();

class TogglePage extends BasePageObject {}

const setupTest = (testFn: (page: TogglePage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new TogglePage(browser);
    await browser.url('#/light/toggle/labels-highlight');
    await testFn(page);
  });
};

test(
  'label should not stretch to the entire container width',
  setupTest(async page => {
    const { width: elementWidth } = await page.getBoundingBox(toggleWrapper.toSelector());
    const { width: labelWidth } = await page.getBoundingBox(toggleWrapper.findLabel().toSelector());
    expect(labelWidth).toBeLessThan(elementWidth);
  })
);
