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
        await page.scrollIntoView('[data-testid="scroll-me"]');
      },
    },
    {
      description: 'Style API v2',
      path: 'copy-to-clipboard/style-api-v2',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'Style API v2 - status popover open',
      path: 'copy-to-clipboard/style-api-v2',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findCopyToClipboard().findCopyButton().toSelector());
      },
    },
  ],
};

export default suite;
