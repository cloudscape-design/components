// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const testStates = [
  { toggle: 'toggle-invalid', label: 'invalid', isInteractive: true },
  { toggle: 'toggle-disabled', label: 'disabled', isInteractive: false },
  { toggle: 'toggle-readonly', label: 'readonly', isInteractive: true },
  { toggle: 'toggle-warning', label: 'warning', isInteractive: true },
];

function pseudoSelectorTests(withStyling: boolean): TestSuite {
  return {
    description: withStyling ? 'Pseudo Selectors with Custom Styling' : 'Pseudo Selectors',
    tests: testStates.flatMap(state => [
      {
        description: `${state.label} - focus`,
        path: 'textarea/pseudo-selectors',
        screenshotType: 'screenshotArea' as const,
        setup: async ({ page, wrapper }) => {
          const textareaSelector = wrapper
            .findTextarea('[data-testid="test-textarea"]')
            .findNativeTextarea()
            .toSelector();
          if (withStyling) {
            await page.click('#toggle-styling');
          }
          await page.click(`#${state.toggle}`);
          if (state.isInteractive) {
            await page.click(textareaSelector);
          }
        },
      },
      {
        description: `${state.label} - focus + hover`,
        path: 'textarea/pseudo-selectors',
        screenshotType: 'screenshotArea' as const,
        setup: async ({ page, wrapper }) => {
          const textareaSelector = wrapper
            .findTextarea('[data-testid="test-textarea"]')
            .findNativeTextarea()
            .toSelector();
          if (withStyling) {
            await page.click('#toggle-styling');
          }
          await page.click(`#${state.toggle}`);
          if (state.isInteractive) {
            await page.click(textareaSelector);
          }
          await page.hoverElement(textareaSelector);
        },
      },
    ]),
  };
}

const suite: TestSuite = {
  description: 'Textarea',
  componentName: 'textarea',
  tests: [
    {
      description: 'Permutations',
      path: 'textarea/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Style Permutations',
      path: 'textarea/style-permutations',
      screenshotType: 'permutations',
    },
    pseudoSelectorTests(false),
    pseudoSelectorTests(true),
  ],
};

export default suite;
