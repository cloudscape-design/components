// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const borderTolerance = 2;

const multiselect = createWrapper().findMultiselect();
const dropdown = multiselect.findDropdown();
const optionSelector = dropdown.findHighlightedOption().toSelector();
const optionsContainerSelector = dropdown.findOptionsContainer().toSelector();
const selectAllSelector = dropdown.findSelectAll().toSelector();

function setup(
  { visualRefresh = false }: { visualRefresh?: boolean; virtualScroll?: boolean },
  testFn: (page: BasePageObject) => Promise<void>
) {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await page.setWindowSize({ width: 950, height: 300 });
    const params = new URLSearchParams({ visualRefresh: String(visualRefresh) }).toString();
    await browser.url(`/#/light/multiselect/select-all?${params}`);
    await page.click(multiselect.findTrigger().toSelector());
    await testFn(page);
  });
}

describe('Scrolling with "Select all"', () => {
  describe.each([false, true])('visualRefresh=%s', visualRefresh => {
    describe.each([true, false])('virtualScroll=%s', (virtualScroll: boolean) => {
      test(
        'the bottom of the highlighted option lies up with the bottom of dropdown when going down the list',
        setup({ visualRefresh, virtualScroll }, async page => {
          await page.keys(['ArrowDown']);
          const optionBottom = (await page.getBoundingBox(optionSelector)).bottom;
          const dropdownBottom = (await page.getBoundingBox(optionsContainerSelector)).bottom;
          expect(Math.abs(optionBottom - dropdownBottom)).toBeLessThanOrEqual(borderTolerance);
        })
      );
      test(
        'the top of the highlighted option lines up with the bottom of the "select all" option when going up the list',
        setup({ visualRefresh, virtualScroll }, async page => {
          await page.keys(['ArrowUp', 'ArrowUp']);
          const optionTop = (await page.getBoundingBox(optionSelector)).top;
          const selectAllBottom = (await page.getBoundingBox(selectAllSelector)).bottom;
          expect(Math.abs(optionTop - selectAllBottom)).toBeLessThanOrEqual(borderTolerance);
        })
      );
    });
  });
});
