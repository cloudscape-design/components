// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../../../lib/components/test-utils/selectors';
import { AsyncResponsePage } from '../../../../__integ__/page-objects/async-response-page';

type ComponentId = 'autosuggest' | 'multiselect' | 'select';

export class DropdownPageObject extends AsyncResponsePage {
  getWrapperAndTrigger(componentId: ComponentId) {
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
  public waitUntil(fn: () => Promise<boolean>, options: { timeout: number }) {
    return this.browser.waitUntil(fn, options);
  }
}

function setupTest(
  {
    pageWidth,
    componentId,
    triggerWidth,
    expandToViewport,
    asyncLoading = false,
  }: {
    pageWidth: number;
    componentId: ComponentId;
    triggerWidth: number;
    expandToViewport: boolean;
    asyncLoading?: boolean;
  },
  testFn: (page: DropdownPageObject) => Promise<void>
) {
  return useBrowser({ width: pageWidth, height: 1000 }, async browser => {
    await browser.url(
      `#/light/dropdown/width?component=${componentId}&expandToViewport=${expandToViewport}&triggerWidth=${triggerWidth}px&asyncLoading=${asyncLoading}&manualServerMock=${asyncLoading}`
    );
    const page = new DropdownPageObject(browser);
    await page.waitForVisible(page.getWrapperAndTrigger(componentId).wrapper.toSelector());
    await testFn(page);
  });
}

async function openDropdown({
  componentId,
  page,
  expandToViewport,
}: {
  componentId: ComponentId;
  page: DropdownPageObject;
  expandToViewport: boolean;
}) {
  const { wrapper, trigger } = page.getWrapperAndTrigger(componentId);
  await page.click(trigger.toSelector());
  const openDropdownSelector = wrapper.findDropdown({ expandToViewport }).findOpenDropdown().toSelector();
  await expect(openDropdownSelector).toBeTruthy();
  return { selector: openDropdownSelector, box: await page.getBoundingBox(openDropdownSelector) };
}

function testForAllCases(
  {
    pageWidth,
    triggerWidth,
    asyncLoading = false,
  }: { pageWidth: number; triggerWidth: number; asyncLoading?: boolean },
  testFn: ({
    page,
    componentId,
    expandToViewport,
  }: {
    page: DropdownPageObject;
    componentId: ComponentId;
    expandToViewport: boolean;
  }) => Promise<void>
) {
  describe.each([false, true])('expandToViewport: %s', expandToViewport => {
    test.each(['autosuggest', 'multiselect', 'select'])('with %s', componentId =>
      setupTest(
        {
          asyncLoading,
          componentId: componentId as ComponentId,
          expandToViewport,
          pageWidth,
          triggerWidth,
        },
        page => testFn({ page, componentId: componentId as ComponentId, expandToViewport })
      )()
    );
  });
}

describe('Dropdown width', () => {
  const triggerWidth = 200;
  describe('stretches beyond the trigger width if there is enough space', () => {
    const pageWidth = 500;
    testForAllCases({ pageWidth, triggerWidth }, async ({ page, componentId, expandToViewport }) => {
      const { box: dropdownBox } = await openDropdown({
        componentId: componentId as ComponentId,
        page,
        expandToViewport,
      });
      expect(dropdownBox.width).toBeGreaterThan(triggerWidth);
      expect(dropdownBox.left + dropdownBox.width).toBeLessThanOrEqual(pageWidth);
    });
  });
  describe('does not overflow the viewport', () => {
    const pageWidth = 350;
    testForAllCases({ pageWidth, triggerWidth }, async ({ page, componentId, expandToViewport }) => {
      const { box: dropdownBox } = await openDropdown({
        componentId: componentId as ComponentId,
        page,
        expandToViewport,
      });
      expect(dropdownBox.left + dropdownBox.width).toBeLessThanOrEqual(pageWidth);
    });
  });
  describe('keeps not overflowing the viewport after re-rendering wider', () => {
    const pageWidth = 500;
    testForAllCases(
      { pageWidth, triggerWidth, asyncLoading: true },
      async ({ page, componentId, expandToViewport }) => {
        const { box: dropdownBox, selector: dropdownSelector } = await openDropdown({
          componentId: componentId as ComponentId,
          page,
          expandToViewport,
        });
        expect(dropdownBox.left + dropdownBox.width).toBeLessThanOrEqual(pageWidth);
        await expect(page.getText(dropdownSelector)).resolves.toContain('Loading');
        await page.flushResponse();
        await expect(page.getText(dropdownSelector)).resolves.toContain('A very');
        const newBox = await page.getBoundingBox(dropdownSelector);
        expect(newBox.left + newBox.width).toBeLessThanOrEqual(pageWidth);
      }
    );
  });
});
