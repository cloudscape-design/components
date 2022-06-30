// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';

test(
  'Should focus input after opening the modal',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/modal/with-input-focus');
    await page.click('#open-modal');
    const inputSelector = createWrapper().findInput('#input').findNativeInput().toSelector();
    await expect(page.isFocused(inputSelector)).resolves.toBe(true);
  })
);

test.each(['destructible', 'controlled'])(`should reset focus to previously active element (%s)`, name =>
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/modal/focus-restoration');
    await page.click(`#${name}`);
    await page.keys('Enter');
    await expect(page.isFocused(`#${name}`)).resolves.toBe(true);
  })()
);
