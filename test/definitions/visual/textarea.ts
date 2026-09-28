// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite, Wrapper } from '../types';

const getTextareaSelector = (wrapper: Wrapper) =>
  wrapper.findTextarea('[data-testid="test-textarea"]').findNativeTextarea().toSelector();

const testStates = [
  { toggle: 'toggle-invalid', label: 'invalid', isInteractive: true },
  { toggle: 'toggle-disabled', label: 'disabled', isInteractive: false },
  { toggle: 'toggle-readonly', label: 'readonly', isInteractive: true },
  { toggle: 'toggle-warning', label: 'warning', isInteractive: true },
];

function stateTests(withCustomStyling: boolean): TestDefinition[] {
  return testStates.flatMap<TestDefinition>(state => [
    {
      description: `${state.label} - focus`,
      path: 'textarea/pseudo-selectors',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        if (withCustomStyling) {
          await page.click('#toggle-styling');
        }
        await page.click(`#${state.toggle}`);
        if (state.isInteractive) {
          await page.click(getTextareaSelector(wrapper));
        }
      },
    },
    {
      description: `${state.label} - focus + hover`,
      path: 'textarea/pseudo-selectors',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        const textareaSelector = getTextareaSelector(wrapper);
        if (withCustomStyling) {
          await page.click('#toggle-styling');
        }
        await page.click(`#${state.toggle}`);
        if (state.isInteractive) {
          await page.click(textareaSelector);
        }
        await page.hoverElement(textareaSelector);
      },
    },
  ]);
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
    {
      description: 'Pseudo Selectors',
      tests: [
        ...stateTests(false),
        {
          description: 'with Custom Styling',
          tests: stateTests(true),
        },
      ],
    },
  ],
};

export default suite;
