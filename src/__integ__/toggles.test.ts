// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../lib/components/test-utils/selectors';

const wrappers = {
  checkbox: createWrapper().findCheckbox(),
  toggle: createWrapper().findToggle(),
};

Object.keys(wrappers).forEach(componentName => {
  describe(componentName, () => {
    const wrapper = wrappers[componentName as keyof typeof wrappers];
    const nativeInputSelector = wrapper.findNativeInput().toSelector();

    function setupTest(testFn: (page: BasePageObject) => Promise<void>) {
      return useBrowser(async browser => {
        const page = new BasePageObject(browser);
        await browser.url(`#light/${componentName}/focus-test`);
        await testFn(page);
      });
    }

    test(
      'can be checked by clicking on native control',
      setupTest(async page => {
        await page.click(nativeInputSelector);
        await expect(page.isSelected(nativeInputSelector)).resolves.toBe(true);
      })
    );
  });
});
