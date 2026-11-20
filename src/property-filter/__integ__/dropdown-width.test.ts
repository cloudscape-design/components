// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const DROPDOWN_MAX_WIDTH = 465;
const DROPDOWN_MIN_WIDTH = 300;

describe.each([false, true])('expandToViewport=%s', expandToViewport => {
  const wrapper = createWrapper().findPropertyFilter();
  const dropdown = wrapper.findDropdown({ expandToViewport }).findOpenDropdown();

  test(
    'widens the open dropdown when long value suggestions appear',
    useBrowser({ width: 1200, height: 800 }, async browser => {
      await browser.url(`#/light/property-filter/long-values?expandToViewport=${expandToViewport}`);
      const page = new BasePageObject(browser);
      await page.waitForVisible(wrapper.findNativeInput().toSelector());

      await page.click(wrapper.findNativeInput().toSelector());
      await page.waitForVisible(dropdown.toSelector());
      await expect(page.getBoundingBox(dropdown.toSelector())).resolves.toEqual(
        expect.objectContaining({ width: DROPDOWN_MIN_WIDTH })
      );

      await page.keys('Identifier = '.split(''));
      await page.waitForAssertion(() =>
        expect(page.getBoundingBox(dropdown.toSelector())).resolves.toEqual(
          expect.objectContaining({ width: DROPDOWN_MAX_WIDTH })
        )
      );
    })
  );
});
