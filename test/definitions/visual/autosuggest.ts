// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import createWrapper from '../../../lib/components/test-utils/selectors';
import { TestDefinition, TestSuite } from '../types';

const wrapper = createWrapper();

const suite: TestSuite = {
  description: 'Autosuggest',
  componentName: 'autosuggest',
  tests: [
    {
      description: 'permutations',
      path: 'autosuggest/permutations',
      screenshotType: 'permutations',
      setup: async page => {
        await page.click('input');
      },
    },
    {
      description: 'permutations for async properties',
      path: 'autosuggest/permutations-async',
      screenshotType: 'permutations',
      setup: async page => {
        await page.click('input');
      },
    },
    {
      description: 'Displays options with groups correctly',
      path: 'autosuggest/scenarios',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('input');
      },
    },
    {
      description: 'Correctly displays dropdown regions',
      path: 'autosuggest/regions-scenarios',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('input');
      },
    },
    {
      description: 'Long virtual list - navigate to last item',
      path: 'autosuggest/virtual-scroll',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click(wrapper.findAutosuggest().findNativeInput().toSelector());
        await page.keys(['ArrowUp']);
      },
    },
    ...[true, false].map(
      virtualScroll =>
        ({
          description: `with custom renderOption (virtualScroll=${virtualScroll})`,
          path: 'autosuggest/custom-render-option',
          screenshotType: 'screenshotArea' as const,
          queryParams: { virtualScroll: String(virtualScroll) },
          setup: async page => {
            await page.click(wrapper.findAutosuggest().findNativeInput().toSelector());
            await page.keys(['ArrowDown']);
          },
        }) as TestDefinition
    ),
  ],
};

export default suite;
