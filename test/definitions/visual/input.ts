// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const focusStatesPath = 'input/focus-states';
const inputSelector = (testId: string) => `[data-testid="${testId}"] input`;
// Pointer target outside any input: the page heading.
const headingSelector = 'h1';

const suite: TestSuite = {
  description: 'Input',
  componentName: 'input',
  tests: [
    {
      description: 'permutations',
      path: 'input/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'style-permutations',
      path: 'input/style-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Inline label permutations',
      path: 'input/inline-label-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'focus states - rest',
      path: focusStatesPath,
      screenshotType: 'screenshotArea',
    },
    // Focus is produced with page.click(): the input's focus styles are plain CSS :focus/:focus-within,
    // which a dispatched focusin event (page.focusInputs()) does not trigger. Only one element can hold
    // focus, so each input gets its own focused entry.
    ...['readonly', 'native-invalid', 'suffix', 'prefix'].flatMap(
      testId =>
        [
          {
            description: `focus states - focused ${testId}`,
            path: focusStatesPath,
            screenshotType: 'screenshotArea',
            setup: async ({ page }) => {
              await page.click(inputSelector(testId));
            },
          },
          {
            description: `focus states - focused ${testId}, pointer away`,
            path: focusStatesPath,
            screenshotType: 'screenshotArea',
            setup: async ({ page }) => {
              await page.click(inputSelector(testId));
              await page.hoverElement(headingSelector);
            },
          },
        ] as TestDefinition[]
    ),
  ],
};

export default suite;
