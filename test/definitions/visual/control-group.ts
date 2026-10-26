// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite, Wrapper } from '../types';

// Scoped to the screenshot area: the settings panel above it also contains native inputs.
const firstInput = (wrapper: Wrapper) => wrapper.find('.screenshot-area').findInput().findNativeInput().toSelector();

const autosuggestInput = (wrapper: Wrapper, testId: string) =>
  wrapper.findAutosuggest(`[data-testid="${testId}"]`).findNativeInput().toSelector();

const suite: TestSuite = {
  description: 'Control group',
  componentName: 'control-group',
  tests: [
    {
      description: 'Permutations',
      path: 'control-group/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Permutations (direction: vertical)',
      path: 'control-group/permutations',
      screenshotType: 'permutations',
      queryParams: { controlGroupDirection: 'vertical' },
    },
    {
      description: 'Action button',
      path: 'control-group/action-button',
      screenshotType: 'permutations',
    },
    {
      description: 'Action button (direction: vertical)',
      path: 'control-group/action-button',
      screenshotType: 'permutations',
      queryParams: { controlGroupDirection: 'vertical' },
    },
    {
      description: 'Labels - open dropdown of standalone select',
      path: 'control-group/labels',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findSelect('[data-testid="standalone-select"]').findTrigger().toSelector());
      },
    },
    {
      description: 'Labels - open dropdown of first control group',
      path: 'control-group/labels',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findSelect('[data-testid="grouped-select"]').findTrigger().toSelector());
      },
    },
    {
      description: 'In app layout',
      path: 'control-group/in-app-layout',
      screenshotType: 'screenshotArea',
    },
    ...['error', 'warning', undefined].flatMap(groupValidationState =>
      ['horizontal', 'vertical'].flatMap(direction =>
        [true, false].flatMap<TestSuite>(actionButton =>
          ['input,select,multiselect', ''].map<TestSuite>(disabledControls => {
            const queryParams: Record<string, string> = {
              controlGroupDirection: direction,
              label: 'true',
              disabled: disabledControls,
              ...(groupValidationState ? { group: groupValidationState } : {}),
              ...(actionButton ? { actionButton: 'true' } : {}),
            };
            return {
              description: `Validation - ${groupValidationState}, ${direction}, ${actionButton ? 'with' : 'without'} action button`,
              tests: [
                {
                  description: 'focus on input',
                  path: 'control-group/validation',
                  screenshotType: 'screenshotArea',
                  queryParams,
                  setup: async ({ page, wrapper }) => {
                    await page.click(firstInput(wrapper));
                  },
                },
                {
                  description: 'focus on select',
                  path: 'control-group/validation',
                  screenshotType: 'screenshotArea',
                  queryParams,
                  setup: async ({ page, wrapper }) => {
                    await page.click(firstInput(wrapper));
                    await page.keys(['Tab']);
                  },
                },
                {
                  description: 'focus on segmented control',
                  path: 'control-group/validation',
                  screenshotType: 'screenshotArea',
                  queryParams,
                  setup: async ({ page, wrapper }) => {
                    await page.click(firstInput(wrapper));
                    await page.keys(['Tab']);
                    await page.keys(['Tab']);
                    await page.keys(['Tab']);
                  },
                },
                {
                  description: 'focus on autosuggest',
                  path: 'control-group/validation',
                  screenshotType: 'screenshotArea',
                  queryParams,
                  setup: async ({ page, wrapper }) => {
                    await page.click(autosuggestInput(wrapper, 'autosuggest'));
                  },
                },
                {
                  description: 'Permutations - focus on autosuggest with inline tokens',
                  path: 'control-group/permutations',
                  screenshotType: 'screenshotArea',
                  setup: async ({ page, wrapper }) => {
                    await page.click(autosuggestInput(wrapper, 'autosuggest-tokens'));
                  },
                },
              ],
            };
          })
        )
      )
    ),
  ],
};
export default suite;
