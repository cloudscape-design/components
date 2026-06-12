// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'PromptInput',
  componentName: 'prompt-input',
  tests: [
    {
      description: 'Permutations at 250',
      path: 'prompt-input/permutations',
      screenshotType: 'permutations',
      configuration: { width: 250 },
    },
    {
      description: 'Permutations at 400',
      path: 'prompt-input/permutations',
      screenshotType: 'permutations',
      configuration: { width: 400 },
    },
    {
      description: 'Permutations at 800',
      path: 'prompt-input/permutations',
      screenshotType: 'permutations',
      configuration: { width: 800 },
    },
    {
      description: 'Style Permutations',
      path: 'prompt-input/style-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'focus ring on the last secondary action',
      path: 'prompt-input/simple',
      screenshotType: 'screenshotArea',
      queryParams: { hasSecondaryActions: 'true' },
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findPromptInput('[data-testid="prompt-input"]').findNativeTextarea().toSelector());
        await page.keys(['Tab', 'ArrowRight', 'ArrowRight']);
      },
    },
  ],
};

export default suite;
