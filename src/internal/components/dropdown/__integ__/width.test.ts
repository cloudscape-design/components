// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../../../lib/components/test-utils/selectors';

type ComponentId = 'autosuggest' | 'multiselect' | 'select';

function getWrapperAndTrigger(componentId: ComponentId) {
  const wrapper = createWrapper();
  let componentWrapper;
  switch (componentId) {
    case 'autosuggest':
      componentWrapper = wrapper.findAutosuggest();
      return {
        wrapper: componentWrapper,
        trigger: componentWrapper.findNativeInput(),
      };
    case 'multiselect':
      componentWrapper = wrapper.findMultiselect();
      return {
        wrapper: componentWrapper,
        trigger: componentWrapper.findTrigger(),
      };
    case 'select':
      componentWrapper = wrapper.findSelect();
      return {
        wrapper: componentWrapper,
        trigger: componentWrapper.findTrigger(),
      };
  }
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
    componentId: ComponentId;
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
    await page.waitForVisible(getWrapperAndTrigger(componentId).wrapper.toSelector());
    await testFn(page);
  });
}

async function openDropdown({
  componentId,
  page,
  expandToViewport,
}: {
  componentId: ComponentId;
  page: BasePageObject;
  expandToViewport: boolean;
}) {
  const { wrapper, trigger } = getWrapperAndTrigger(componentId);
  await page.click(trigger.toSelector());
  const openDropdownSelector = wrapper.findDropdown({ expandToViewport }).findOpenDropdown().toSelector();
  await expect(openDropdownSelector).toBeTruthy();
  return page.getBoundingBox(openDropdownSelector);
}

describe('Dropdown width', () => {
  const triggerWidth = 200;
  describe('stretches beyond the trigger width if there is enough space', () => {
    const pageWidth = 500;
    describe.each([false, true])('expandToViewport: %s', expandToViewport => {
      test.each(['autosuggest', 'multiselect', 'select'])('with %s', componentId =>
        setupTest(
          { componentId: componentId as ComponentId, triggerWidth, pageWidth, expandToViewport, virtualScroll: false },
          async page => {
            const dropdownBox = await openDropdown({ componentId: componentId as ComponentId, page, expandToViewport });
            expect(dropdownBox.width).toBeGreaterThan(triggerWidth);
            expect(dropdownBox.left + dropdownBox.width).toBeLessThanOrEqual(pageWidth);
          }
        )()
      );
    });
  });
  describe('does not overflow the viewport', () => {
    const pageWidth = 350;
    describe.each([false, true])('expandToViewport: %s', expandToViewport => {
      test.each(['autosuggest', 'multiselect', 'select'])('with %s', componentId =>
        setupTest(
          { componentId: componentId as ComponentId, triggerWidth, pageWidth, expandToViewport, virtualScroll: false },
          async page => {
            const dropdownBox = await openDropdown({ componentId: componentId as ComponentId, page, expandToViewport });
            expect(dropdownBox.left + dropdownBox.width).toBeLessThanOrEqual(pageWidth);
          }
        )()
      );
    });
  });
});
