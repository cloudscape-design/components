// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Wizard',
  componentName: 'wizard',
  tests: [
    ...[600, 1280].map(width => ({
      description: `width ${width}px`,
      tests: [
        {
          description: 'first step',
          path: 'wizard/wizard-screenshot',
          screenshotType: 'screenshotArea' as const,
          configuration: { width },
        },
        {
          description: 'second step',
          path: 'wizard/wizard-screenshot',
          screenshotType: 'screenshotArea' as const,
          configuration: { width },
          setup: async ({ page }: { page: any }) => {
            await page.click('#next');
          },
        },
      ],
    })),
    {
      description: 'steps menu expanded in mobile view',
      path: 'wizard/wizard-screenshot',
      screenshotType: 'screenshotArea',
      configuration: { width: 600 },
      setup: async ({ page }) => {
        await page.click('[role="button"][aria-expanded]');
      },
    },
  ],
};

export default suite;
