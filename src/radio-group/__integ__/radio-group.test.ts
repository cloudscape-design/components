// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper, { RadioGroupWrapper } from '../../../lib/components/test-utils/selectors';

const radioGroupWrapper = createWrapper().findRadioGroup('#simple');

class RadioPage extends BasePageObject {
  async selectRadio(wrapper: RadioGroupWrapper, value: string) {
    await this.click(wrapper.findInputByValue(value).toSelector());
  }

  isValueSelected(wrapper: RadioGroupWrapper, value: string) {
    return this.isSelected(wrapper.findInputByValue(value).toSelector());
  }
}

const setupTest = (testFn: (page: RadioPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new RadioPage(browser);
    await browser.url('#/light/radio-group/index');
    await page.waitForVisible(radioGroupWrapper.findButtons().toSelector());
    await testFn(page);
  });
};

test(
  'Value is correctly updated',
  setupTest(async page => {
    await expect(page.isValueSelected(radioGroupWrapper, 'one')).resolves.toBe(false);
    await expect(page.isValueSelected(radioGroupWrapper, 'two')).resolves.toBe(true);

    await page.selectRadio(radioGroupWrapper, 'one');

    await expect(page.isValueSelected(radioGroupWrapper, 'one')).resolves.toBe(true);
    await expect(page.isValueSelected(radioGroupWrapper, 'two')).resolves.toBe(false);
  })
);

test(
  'Disabled item cannot be selected',
  setupTest(async page => {
    await page.selectRadio(radioGroupWrapper, 'three');

    await expect(page.isValueSelected(radioGroupWrapper, 'two')).resolves.toBe(true);
    await expect(page.isValueSelected(radioGroupWrapper, 'three')).resolves.toBe(false);
  })
);

// regression test for AWSUI-2658
test(
  'properly positioned in a scrollable container',
  setupTest(async page => {
    const scrollDistance = 30;
    const radioInContainerSelector = createWrapper()
      .findRadioGroup('#in-container')
      .findInputByValue('foo')
      .toSelector();
    const { top: positionBefore } = await page.getBoundingBox(radioInContainerSelector);
    await page.elementScrollTo('#scrollable-container', { top: scrollDistance });
    const { top: positionAfter } = await page.getBoundingBox(radioInContainerSelector);
    expect(positionBefore - positionAfter).toEqual(scrollDistance);
  })
);
