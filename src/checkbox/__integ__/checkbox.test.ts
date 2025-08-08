// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();

class CheckboxPage extends BasePageObject {}

const setupTest = (testFn: (page: CheckboxPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new CheckboxPage(browser);
    await browser.url('#/light/checkbox/simple');
    await testFn(page);
  });
};

test(
  'Clicking on form field label should not change checked state',
  setupTest(async page => {
    await page.click(wrapper.findFormField().findLabel().toSelector());
    await expect(
      page.isSelected(wrapper.find('#formfield-with-checkbox').findCheckbox().find('input').toSelector())
    ).resolves.toBe(false);
  })
);

test(
  'style api focus state',
  useBrowser(async browser => {
    await browser.url('#/light/checkbox/style-custom/');
    const page = new CheckboxPage(browser);

    const focusRingSelector = `[data-testid="4"] > span:first-of-type > span:first-of-type > span:last-of-type`;

    await page.click('[data-testid="1"]');
    await page.keys('Tab');
    await page.keys('Tab');

    await expect((await browser.$(focusRingSelector).getCSSProperty('box-shadow', '::before')).value).toBe(
      'rgb(4,125,149)0px0px0px3px'
    );
  })
);
