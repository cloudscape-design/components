// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Wizard',
  componentName: 'wizard',
  tests: [600, 1280].map<TestSuite>(width => {
    const tests: TestDefinition[] = [
      {
        description: 'first step',
        path: 'wizard/wizard-screenshot',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'second step',
        path: 'wizard/wizard-screenshot',
        screenshotType: 'screenshotArea',
        configuration: { width },
        setup: async ({ page }) => {
          await page.click('#next');
        },
      },
    ];

    if (width === 600) {
      tests.push({
        description: 'steps menu expanded in mobile view',
        path: 'wizard/wizard-screenshot',
        screenshotType: 'screenshotArea',
        configuration: { width },
        setup: async ({ page }) => {
          await page.click('[role="button"][aria-expanded]');
        },
      });
    }

    return { description: `width ${width}px`, tests };
  }),
};

export default suite;
