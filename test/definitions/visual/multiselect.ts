// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

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
      description: 'Prop permutation: expandToViewport x virtualScroll x filteringType',
      tests: [true, false].flatMap<TestSuite | TestDefinition>(virtualScroll =>
        [true, false].flatMap(expandToViewport =>
          ['manual', 'auto', 'none'].map<TestDefinition>(filteringType => ({
            description: `expandToViewport=${expandToViewport} virtualScroll=${virtualScroll} filteringType=${filteringType}`,
            path: 'multiselect/screenshot',
            screenshotType: 'screenshotArea',
            queryParams: {
              expandToViewport: expandToViewport.toString(),
              virtualScroll: virtualScroll.toString(),
              filteringType,
            },
            setup: async ({ page, wrapper }) => {
              await page.click(wrapper.findMultiselect().findTrigger().toSelector());
            },
          }))
        )
      ),
    },
    ...[true, false].map<TestSuite>(virtualScroll => ({
      description: `List type - ${virtualScroll ? 'virtual' : 'normal'}`,
      tests: [
        {
          description: 'component - error status wrapping',
          path: 'multiselect/screenshot',
          screenshotType: 'screenshotArea',
          queryParams: { statusType: 'error' } as Record<string, string>,
          setup: async ({ page, wrapper }) => {
            await page.click(wrapper.findMultiselect().findTrigger().toSelector());
          },
        },
        {
          description: 'component - item selected (dropdown stays open)',
          path: 'multiselect/screenshot',
          screenshotType: 'screenshotArea',
          queryParams: { virtualScroll: virtualScroll.toString() },
          setup: async ({ page, wrapper }) => {
            await page.click(wrapper.findMultiselect().findTrigger().toSelector());
            await page.click('[data-test-index="4"]');
          },
        },
        {
          description: 'component - custom render option',
          path: 'multiselect/custom-render-option',
          screenshotType: 'screenshotArea',
          queryParams: { virtualScroll: virtualScroll.toString() },
          setup: async ({ page, wrapper }) => {
            await page.click(wrapper.findMultiselect().findTrigger().toSelector());
          },
        },
        {
          description: 'Select all',
          tests: [false, true].map<TestSuite>(withFiltering => ({
            description: `With filtering - ${withFiltering}`,
            tests: [
              {
                description: 'initial state',
                path: 'multiselect/screenshot',
                screenshotType: 'screenshotArea',
                queryParams: {
                  virtualScroll: virtualScroll.toString(),
                  ...(withFiltering ? { filteringType: 'auto' } : {}),
                  enableSelectAll: 'true',
                },
                setup: async ({ page, wrapper }) => {
                  await page.click(wrapper.findMultiselect().findTrigger().toSelector());
                },
              },
              {
                description: 'hover',
                path: 'multiselect/screenshot',
                screenshotType: 'screenshotArea',
                queryParams: {
                  virtualScroll: virtualScroll.toString(),
                  ...(withFiltering ? { filteringType: 'auto' } : {}),
                  enableSelectAll: 'true',
                },
                setup: async ({ page, wrapper }) => {
                  const dropdown = wrapper.findMultiselect().findDropdown();
                  await page.click(wrapper.findMultiselect().findTrigger().toSelector());
                  await page.hoverElement(dropdown.findSelectAll().toSelector());
                },
              },
              {
                description: 'keyboard focus',
                path: 'multiselect/screenshot',
                screenshotType: 'screenshotArea',
                queryParams: {
                  virtualScroll: virtualScroll.toString(),
                  ...(withFiltering ? { filteringType: 'auto' } : {}),
                  enableSelectAll: 'true',
                },
                setup: async ({ page, wrapper }) => {
                  await page.click(wrapper.findMultiselect().findTrigger().toSelector());
                  // If filtering is enabled, the filter input will be focused and we need to navigate down once.
                  // Otherwise, the first selected option will be focused and we need to go up
                  // until the first position to find the "Select all" control.
                  await page.keys(withFiltering ? 'ArrowDown' : ['ArrowUp', 'ArrowUp', 'ArrowUp']);
                },
              },
              {
                description: 'selected',
                path: 'multiselect/screenshot',
                screenshotType: 'screenshotArea',
                queryParams: {
                  virtualScroll: virtualScroll.toString(),
                  ...(withFiltering ? { filteringType: 'auto' } : {}),
                  enableSelectAll: 'true',
                },
                setup: async ({ page, wrapper }) => {
                  const dropdown = wrapper.findMultiselect().findDropdown();
                  await page.click(wrapper.findMultiselect().findTrigger().toSelector());
                  await page.click(dropdown.findSelectAll().toSelector());
                },
              },
              {
                description: 'stickiness',
                path: 'multiselect/screenshot',
                screenshotType: 'screenshotArea',
                queryParams: {
                  virtualScroll: virtualScroll.toString(),
                  ...(withFiltering ? { filteringType: 'auto' } : {}),
                  enableSelectAll: 'true',
                },
                setup: async ({ page, wrapper }) => {
                  const dropdown = wrapper.findMultiselect().findDropdown();
                  await page.click(wrapper.findMultiselect().findTrigger().toSelector());
                  await page.elementScrollTo(dropdown.findOptionsContainer().toSelector(), { left: 0, top: 10 });
                  await page.waitForJsTimers();
                  // Options in highlighted state have a higher z-index than the rest.
                  // Make sure that they are nonetheless displayed below the "Select all" control and not above.
                  await page.hoverElement(dropdown.findOption(1).toSelector());
                },
              },
            ],
          })),
        },
      ],
    })),
    {
      description: 'List type - virtual long',
      tests: [
        {
          description: 'Long virtual list - navigate to last item',
          path: 'multiselect/virtual-scroll',
          screenshotType: 'screenshotArea',
          queryParams: { type: 'multiselect' },
          setup: async ({ page, wrapper }) => {
            const dropdown = wrapper.findMultiselect().findDropdown();
            await page.click(wrapper.findMultiselect().findTrigger().toSelector());
            // We're using elementScrollTo so we see the 'End of all results' bottom list element
            await page.elementScrollTo(dropdown.findOptionsContainer().toSelector(), { top: 99999 });
            await page.waitForJsTimers();
          },
        },
        {
          description: 'Long virtual list (select all) - navigate to last item',
          path: 'multiselect/virtual-scroll',
          screenshotType: 'screenshotArea',
          queryParams: { type: 'multiselect-select-all' },
          setup: async ({ page, wrapper }) => {
            const dropdown = wrapper.findMultiselect().findDropdown();
            await page.click(wrapper.findMultiselect().findTrigger().toSelector());
            // We're using elementScrollTo so we see the 'End of all results' bottom list element
            await page.elementScrollTo(dropdown.findOptionsContainer().toSelector(), { top: 99999 });
            await page.waitForJsTimers();
          },
        },
      ],
    },
  ],
};

export default suite;
