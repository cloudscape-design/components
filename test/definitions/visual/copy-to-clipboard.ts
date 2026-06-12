// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

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
        await (page as any).scrollIntoView('[data-testid="scroll-me"]');
      },
    },
  ],
};

export default suite;
