// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'PromptInput',
  componentName: 'prompt-input',
  tests: [
    ...[250, 400, 800].map<TestDefinition>(width => ({
      description: `Permutations at ${width}`,
      path: 'prompt-input/permutations',
      screenshotType: 'permutations',
      configuration: { width },
    })),
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
