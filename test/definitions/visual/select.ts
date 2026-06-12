// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

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
    {
      description: 'component - dropdown open - plain list',
      path: 'select/screenshot',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('[data-testid="select-demo"] button');
      },
    },
    {
      description: 'component - dropdown open - virtual list',
      path: 'select/screenshot',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('#toggle-virtual');
        await page.click('[data-testid="select-demo"] button');
      },
    },
    {
      description: 'component - dropdown open limited width - plain list',
      path: 'select/screenshot',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('[data-testid="select-demo-with-no-filtering-and-limited-width"] button');
      },
    },
    {
      description: 'keyboard interaction - plain list',
      path: 'select/screenshot',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('[data-testid="select-demo-no-filtering"] button');
        await page.keys(['ArrowDown', 'Space']);
      },
    },
    {
      description: 'component - custom render option - plain list',
      path: 'select/custom-render-option',
      screenshotType: 'screenshotArea',
      queryParams: { virtualScroll: 'false' },
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findSelect().findTrigger().toSelector());
      },
    },
    {
      description: 'component - custom render option - virtual list',
      path: 'select/custom-render-option',
      screenshotType: 'screenshotArea',
      queryParams: { virtualScroll: 'true' },
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findSelect().findTrigger().toSelector());
      },
    },
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
        await page.click(wrapper.findSelect().findTrigger().toSelector());
        await page.elementScrollTo(wrapper.findSelect().findDropdown().findOptionsContainer().toSelector(), {
          top: 99999,
        });
      },
    },
  ],
};

export default suite;
