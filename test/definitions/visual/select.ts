// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import VisualTestPageObject from '../page-object';
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Select',
  componentName: 'select',
  tests: [
    {
      description: 'component - dropdown closed',
      path: 'select/screenshot',
      screenshotType: 'screenshotArea',
    },
    ...['plain', 'virtual'].map<TestSuite>(listType => {
      const openVirtualIfNeeded = async (page: VisualTestPageObject) => {
        if (listType === 'virtual') {
          await page.click('#toggle-virtual');
        }
      };
      return {
        description: `List type - ${listType}`,
        tests: [
          {
            description: 'component - dropdown open',
            path: 'select/screenshot',
            screenshotType: 'screenshotArea',
            setup: async ({ page }) => {
              await openVirtualIfNeeded(page);
              await page.click('[data-testid="select-demo"] button');
            },
          },
          {
            description: 'component - dropdown open limited width',
            path: 'select/screenshot',
            screenshotType: 'screenshotArea',
            setup: async ({ page }) => {
              await openVirtualIfNeeded(page);
              await page.click('[data-testid="select-demo-with-no-filtering-and-limited-width"] button');
            },
          },
          {
            description: 'keyboard interaction',
            path: 'select/screenshot',
            screenshotType: 'screenshotArea',
            setup: async ({ page }) => {
              await openVirtualIfNeeded(page);
              await page.click('[data-testid="select-demo-no-filtering"] button');
              await page.keys(['ArrowDown', 'Space']);
            },
          },
          {
            description: 'component - custom render option',
            path: 'select/custom-render-option',
            screenshotType: 'screenshotArea',
            queryParams: { virtualScroll: (listType === 'virtual').toString() },
            setup: async ({ page, wrapper }) => {
              await page.click(wrapper.findSelect().findTrigger().toSelector());
            },
          },
        ],
      };
    }),
    {
      description: 'item permutations',
      path: 'select/item.permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'selectable-item permutations',
      path: 'selectable-item/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'trigger permutations',
      path: 'select/trigger.permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Long virtual list - navigate to last item',
      path: 'select/virtual-scroll',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        const select = wrapper.findSelect();
        await page.click(select.findTrigger().toSelector());
        // We're using elementScrollTo so we see the 'End of all results' bottom list element
        await page.elementScrollTo(select.findDropdown().findOptionsContainer().toSelector(), { top: 99999 });
      },
    },
  ],
};

export default suite;
