// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import VisualTestPageObject from '../page-object';
import { TestDefinition, TestSuite, Wrapper } from '../types';

const addTokens = async (page: VisualTestPageObject, wrapper: Wrapper, count: number) => {
  for (let i = 0; i < count; i++) {
    await page.click(wrapper.find('[data-testid="add-token"]').toSelector());
  }
};

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
      screenshotType: 'permutations',
    },
    {
      description: 'token mode with a focused token',
      path: 'autosuggest/token-mode',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        await addTokens(page, wrapper, 2);
        await page.click(wrapper.findAutosuggest().findNativeInput().toSelector());
        await page.keys(['Backspace']);
      },
    },
    {
      description: 'token mode with overflow dropdown open',
      path: 'autosuggest/token-mode',
      screenshotType: 'screenshotArea',
      configuration: { width: 600 },
      setup: async ({ page, wrapper }) => {
        await addTokens(page, wrapper, 6);
        await page.click(wrapper.findAutosuggest().findOverflowTrigger().toSelector());
      },
    },
  ],
};

export default suite;
