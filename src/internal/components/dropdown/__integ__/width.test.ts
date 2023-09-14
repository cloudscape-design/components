// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../../../lib/components/test-utils/selectors';

function getWrapper(componentId: string) {
  return componentId === 'multiselect' ? createWrapper().findMultiselect() : createWrapper().findSelect();
}

function setupTest(
  {
    pageWidth,
    componentId,
    triggerWidth,
    expandToViewport,
    virtualScroll,
  }: {
    pageWidth: number;
    componentId: string;
    triggerWidth: number;
    expandToViewport: boolean;
    virtualScroll: boolean;
  },
  testFn: (page: BasePageObject) => Promise<void>
) {
  return useBrowser({ width: pageWidth, height: 1000 }, async browser => {
    await browser.url(
      `#/light/dropdown/width?component=${componentId}&expandToViewport=${expandToViewport}&width=${triggerWidth}px&virtualScroll=${virtualScroll}`
    );
    const page = new BasePageObject(browser);
    await page.waitForVisible(getWrapper(componentId).toSelector());
    await testFn(page);
  });
}

async function openDropdown({
  componentId,
  page,
  expandToViewport,
}: {
  componentId: string;
  page: BasePageObject;
  expandToViewport: boolean;
}) {
  const wrapper = getWrapper(componentId);
  await page.click(wrapper.findTrigger().toSelector());
  const openDropdownSelector = wrapper.findDropdown({ expandToViewport }).findOpenDropdown().toSelector();
  await expect(openDropdownSelector).toBeTruthy();
  return page.getBoundingBox(openDropdownSelector);
}

describe('Dropdown width', () => {
  const triggerWidth = 200;
  describe('overflows the trigger width if there is enough space', () => {
    const pageWidth = 500;
    describe.each([false, true])('expandToViewport: %s', expandToViewport => {
      test.each(['multiselect', 'select'])('%s', componentId =>
        setupTest({ componentId, triggerWidth, pageWidth, expandToViewport, virtualScroll: false }, async page => {
          const dropdownBox = await openDropdown({ componentId, page, expandToViewport });
          expect(dropdownBox.width).toBeGreaterThan(triggerWidth);
          expect(dropdownBox.left + dropdownBox.width).toBeLessThanOrEqual(pageWidth);
        })()
      );
    });
  });
  describe('does not overflow the viewport', () => {
    const pageWidth = 350;
    describe.each([false, true])('expandToViewport: %s', expandToViewport => {
      test.each(['multiselect', 'select'])('%s', componentId =>
        setupTest({ componentId, triggerWidth, pageWidth, expandToViewport, virtualScroll: false }, async page => {
          const dropdownBox = await openDropdown({ componentId, page, expandToViewport });
          expect(dropdownBox.left + dropdownBox.width).toBeLessThanOrEqual(pageWidth);
        })()
      );
    });
  });
});
