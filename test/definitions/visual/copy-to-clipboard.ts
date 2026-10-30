// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const motionPath = 'copy-to-clipboard/motion';
const triggerSelector = (testId: string) => `[data-testid="${testId}"] button`;

const suite: TestSuite = {
  description: 'CopyToClipboard',
  componentName: 'copy-to-clipboard',
  tests: [
    {
      description: 'Variants',
      path: 'copy-to-clipboard/simple',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'copy-to-clipboard below bottom split panel is not visible',
      path: 'copy-to-clipboard/scenario-split-panel',
      screenshotType: 'screenshotArea',
      configuration: { width: 1280, height: 900 },
      setup: async ({ page }) => {
        await page.click('[aria-label="Copy dummy text"]');
        await page.scrollIntoView('[data-testid="scroll-me"]');
      },
    },
    // One Theme swaps the copy glyph for a status glyph after a copy; capture that end state while it is held.
    ...['copy-button', 'copy-icon', 'copy-inline'].flatMap(
      testId =>
        [
          {
            description: `One Theme glyph swap - ${testId} after successful copy`,
            path: motionPath,
            screenshotType: 'screenshotArea',
            queryParams: { theme: 'one-theme' },
            setup: async ({ page }) => {
              await page.click(triggerSelector(testId));
              // Wait out the popover's settle animation so it is captured at rest.
              await page.waitForJsTimers(300);
            },
          },
          {
            description: `One Theme glyph swap - ${testId} after failed copy`,
            path: motionPath,
            screenshotType: 'screenshotArea',
            queryParams: { theme: 'one-theme', copyFails: 'true' },
            setup: async ({ page }) => {
              await page.click(triggerSelector(testId));
              await page.waitForJsTimers(300);
            },
          },
        ] as TestDefinition[]
    ),
  ],
};

export default suite;
