// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const buttonGroup = createWrapper().findButtonGroup();

// First button group elements
const button1 = buttonGroup.findContent().findButton('[data-itemid=one]').toSelector();
const button2 = buttonGroup.findContent().findButton('[data-itemid=two]').toSelector();
const dropdown = buttonGroup.findContent().findButtonDropdown().findNativeButton().toSelector();

const beforeSelector = '[data-testid="focus-before"]';

function setup(testFn: (page: BasePageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('/#/light/button-group/composition');
    await testFn(page);
  });
}

test(
  'navigates between buttons with arrow keys',
  setup(async page => {
    await page.click(beforeSelector);

    await page.keys(['Tab']);
    await expect(page.isFocused(button1)).resolves.toBe(true);

    await page.keys(['ArrowRight']);
    await expect(page.isFocused(button2)).resolves.toBe(true);

    await page.keys(['ArrowRight', 'ArrowRight']);
    await expect(page.isFocused(dropdown)).resolves.toBe(true);
  })
);

test(
  'maintains focus when moving back to group',
  setup(async page => {
    await page.click(beforeSelector);

    await page.keys(['Tab']);
    await expect(page.isFocused(button1)).resolves.toBe(true);

    await page.keys(['ArrowRight']);
    await expect(page.isFocused(button2)).resolves.toBe(true);

    await page.keys(['Shift', 'Tab']);
    await expect(page.isFocused(beforeSelector)).resolves.toBe(true);

    await page.keys(['Tab']);
    await expect(page.isFocused(button2)).resolves.toBe(true);
  })
);
