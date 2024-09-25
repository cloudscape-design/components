// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../../../lib/components/test-utils/selectors';

describe('Dropdown and trigger element alignment', () => {
  describe.each(['expandable', 'expandable-iframe'])('%s', pageName => {
    describe.each([true, false])('expandToViewport=%s', expandToViewport => {
      const alignments = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;

      function setupTest(testFn: (page: BasePageObject) => Promise<void>) {
        return useBrowser(async browser => {
          const runInIframe = async (callback: () => Promise<void>) => {
            if (pageName !== 'expandable-iframe') {
              // noop if the page does not use iframes
              return callback();
            }
            const iframeEl = await browser.$('#expandable-dropdowns-iframe');
            await iframeEl.waitForDisplayed();
            await browser.switchToFrame(iframeEl);
            await callback();
            // go back to top
            await browser.switchToFrame(null);
          };
          await browser.url(`#/light/dropdown/${pageName}?expandToViewport=${expandToViewport}`);
          const page = new BasePageObject(browser);
          await runInIframe(async () => {
            await page.waitForVisible(createWrapper().findAutosuggest().toSelector());
            await testFn(page);
          });
        });
      }

      test.each(alignments)('alignment at %s corner', alignment => {
        return setupTest(async page => {
          const wrapper = createWrapper().findAutosuggest(`#${alignment}`);
          await page.click(wrapper.findNativeInput().toSelector());
          const dropdownBox = await page.getBoundingBox(wrapper.findDropdown({ expandToViewport }).toSelector());
          const triggerBox = await page.getBoundingBox(wrapper.findNativeInput().toSelector());
          if (alignment.endsWith('-left')) {
            expect(dropdownBox.left).toEqual(triggerBox.left);
          } else {
            expect(dropdownBox.right).toEqual(triggerBox.right);
          }
          expect(dropdownBox.width).toBeGreaterThanOrEqual(triggerBox.width);
        })();
      });
    });
  });
});
