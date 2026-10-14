// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite, Wrapper } from '../types';

const overflowAutosuggest = (wrapper: Wrapper) => wrapper.find('[data-testid="overflow"]').findAutosuggest();

const suite: TestSuite = {
  description: 'Autosuggest',
  componentName: 'autosuggest',
  tests: [
    {
      description: 'permutations',
      path: 'autosuggest/permutations',
      screenshotType: 'permutations',
      setup: async ({ page }) => {
        await page.focusInputs();
      },
    },
    {
      description: 'permutations for async properties',
      path: 'autosuggest/permutations-async',
      screenshotType: 'permutations',
      setup: async ({ page }) => {
        await page.focusInputs();
      },
    },
    {
      description: 'Displays options with groups correctly',
      path: 'autosuggest/scenarios',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.focusInputs();
      },
    },
    {
      description: 'Correctly displays dropdown regions',
      path: 'autosuggest/regions-scenarios',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.focusInputs();
      },
    },
    {
      description: 'Long virtual list - navigate to last item',
      path: 'autosuggest/virtual-scroll',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findAutosuggest().findNativeInput().toSelector());
        await page.keys(['ArrowUp']);
      },
    },
    ...[true, false].map(
      virtualScroll =>
        ({
          description: `with custom renderOption (virtualScroll=${virtualScroll})`,
          path: 'autosuggest/custom-render-option',
          screenshotType: 'screenshotArea',
          queryParams: { virtualScroll: String(virtualScroll) },
          setup: async ({ page, wrapper }) => {
            await page.click(wrapper.findAutosuggest().findNativeInput().toSelector());
            await page.keys(['ArrowDown']);
          },
        }) as TestDefinition
    ),
    {
      description: 'style permutations',
      path: 'autosuggest/style-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'token mode permutations',
      path: 'autosuggest/token-mode-permutations',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'token mode with suggestions open',
      path: 'autosuggest/token-mode-permutations',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findAutosuggest().findNativeInput().toSelector());
        await page.keys(['u', 's']);
      },
    },
    {
      description: 'token mode with a focused token',
      path: 'autosuggest/token-mode-permutations',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        await page.click(overflowAutosuggest(wrapper).findNativeInput().toSelector());
        await page.keys(['Backspace']);
      },
    },
    {
      description: 'token mode with overflow dropdown open',
      path: 'autosuggest/token-mode-permutations',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        await page.click(overflowAutosuggest(wrapper).findOverflowTrigger().toSelector());
      },
    },
  ],
};

export default suite;
