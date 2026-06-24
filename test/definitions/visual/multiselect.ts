// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Multiselect',
  componentName: 'multiselect',
  tests: [
    {
      description: 'permutations',
      path: 'multiselect/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'inlineLabelText-permutations',
      path: 'multiselect/inline-label-text-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'expandToViewport=true virtualScroll=true filteringType=manual',
      path: 'multiselect/screenshot',
      screenshotType: 'screenshotArea',
      queryParams: { expandToViewport: 'true', virtualScroll: 'true', filteringType: 'manual' },
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findMultiselect().findTrigger().toSelector());
      },
    },
    {
      description: 'expandToViewport=true virtualScroll=true filteringType=auto',
      path: 'multiselect/screenshot',
      screenshotType: 'screenshotArea',
      queryParams: { expandToViewport: 'true', virtualScroll: 'true', filteringType: 'auto' },
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findMultiselect().findTrigger().toSelector());
      },
    },
    {
      description: 'expandToViewport=true virtualScroll=true filteringType=none',
      path: 'multiselect/screenshot',
      screenshotType: 'screenshotArea',
      queryParams: { expandToViewport: 'true', virtualScroll: 'true', filteringType: 'none' },
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findMultiselect().findTrigger().toSelector());
      },
    },
    {
      description: 'expandToViewport=false virtualScroll=false filteringType=manual',
      path: 'multiselect/screenshot',
      screenshotType: 'screenshotArea',
      queryParams: { expandToViewport: 'false', virtualScroll: 'false', filteringType: 'manual' },
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findMultiselect().findTrigger().toSelector());
      },
    },
    {
      description: 'error status wrapping - normal list',
      path: 'multiselect/screenshot',
      screenshotType: 'screenshotArea',
      queryParams: { statusType: 'error' },
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findMultiselect().findTrigger().toSelector());
      },
    },
    {
      description: 'item selected (dropdown stays open) - normal list',
      path: 'multiselect/screenshot',
      screenshotType: 'screenshotArea',
      queryParams: { virtualScroll: 'false' },
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findMultiselect().findTrigger().toSelector());
        await page.click('[data-test-index="4"]');
      },
    },
    {
      description: 'item selected (dropdown stays open) - virtual list',
      path: 'multiselect/screenshot',
      screenshotType: 'screenshotArea',
      queryParams: { virtualScroll: 'true' },
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findMultiselect().findTrigger().toSelector());
        await page.click('[data-test-index="4"]');
      },
    },
    {
      description: 'custom render option - normal list',
      path: 'multiselect/custom-render-option',
      screenshotType: 'screenshotArea',
      queryParams: { virtualScroll: 'false' },
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findMultiselect().findTrigger().toSelector());
      },
    },
    {
      description: 'custom render option - virtual list',
      path: 'multiselect/custom-render-option',
      screenshotType: 'screenshotArea',
      queryParams: { virtualScroll: 'true' },
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findMultiselect().findTrigger().toSelector());
      },
    },
    {
      description: 'Long virtual list - navigate to last item',
      path: 'multiselect/virtual-scroll',
      screenshotType: 'screenshotArea',
      queryParams: { type: 'multiselect' },
      setup: async ({ page, wrapper }) => {
        const triggerSelector = wrapper.findMultiselect().findTrigger().toSelector();
        page.waitForVisible(triggerSelector);
        await page.click(triggerSelector);
        await page.elementScrollTo(wrapper.findMultiselect().findDropdown().findOptionsContainer().toSelector(), {
          top: 99999,
        });
        await page.waitForJsTimers();
      },
    },
    {
      description: 'Long virtual list (select all) - navigate to last item',
      path: 'multiselect/virtual-scroll',
      screenshotType: 'screenshotArea',
      queryParams: { type: 'multiselect-select-all' },
      setup: async ({ page, wrapper }) => {
        const triggerSelector = wrapper.findMultiselect().findTrigger().toSelector();
        page.waitForVisible(triggerSelector);
        await page.click(triggerSelector);
        await page.elementScrollTo(wrapper.findMultiselect().findDropdown().findOptionsContainer().toSelector(), {
          top: 99999,
        });
        await page.waitForJsTimers();
      },
    },
  ],
};

export default suite;
