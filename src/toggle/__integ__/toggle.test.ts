// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();

class TogglePage extends BasePageObject {}

const setupTest = (url: string, testFn: (page: TogglePage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new TogglePage(browser);
    await browser.url(url);
    await testFn(page);
  });
};

test(
  'Clicking on form field label should not change toggle state',
  setupTest('#/light/toggle/simple', async page => {
    await page.click(wrapper.findFormField().findLabel().toSelector());
    await expect(
      page.isSelected(wrapper.find('#formfield-with-toggle').findToggle().find('input').toSelector())
    ).resolves.toBe(false);
  })
);

test(
  'style api focus state',
  useBrowser(async browser => {
    await browser.url('#/light/toggle/style-custom/');
    const toggleSelector = '[data-testid="1"]';
    const page = new TogglePage(browser);
    const focusRingSelector = `${toggleSelector} > span:first-of-type > span:first-of-type > span:last-of-type`;

    await page.click(toggleSelector);
    await page.keys('a');
    await expect((await browser.$(focusRingSelector).getCSSProperty('box-shadow', '::before')).value).toBe(
      'rgb(4,125,149)0px0px0px3px'
    );
  })
);
