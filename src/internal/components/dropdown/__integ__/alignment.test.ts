// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../../../lib/components/test-utils/selectors';

describe('Dropdown and trigger element alignment', () => {
  describe.each([true, false])('expandToViewport=%s', expandToViewport => {
    const alignments = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
    type Alignment = typeof alignments[number];

    function setupTest(alignment: Alignment, testFn: (page: BasePageObject) => Promise<void>) {
      return useBrowser(async browser => {
        await browser.url(`#/light/dropdown/expandable?expandToViewport=${expandToViewport}`);
        const page = new BasePageObject(browser);
        await page.waitForVisible(createWrapper().findAutosuggest().toSelector());
        await testFn(page);
      });
    }

    test.each(alignments)('alignment at %s corner', alignment => {
      return setupTest(alignment, async page => {
        const wrapper = createWrapper().findAutosuggest(`#${alignment}`);
        await page.click(wrapper.findNativeInput().toSelector());
        const dropdownBox = await page.getBoundingBox(wrapper.findDropdown({ expandToViewport }).toSelector());
        const triggerBox = await page.getBoundingBox(wrapper.findNativeInput().toSelector());
        expect(dropdownBox.left).toEqual(triggerBox.left);
        expect(dropdownBox.width).toBeGreaterThanOrEqual(triggerBox.width);
      })();
    });
  });
});
