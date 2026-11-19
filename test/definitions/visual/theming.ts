// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Theming',
  componentName: 'theming',
  tests: [
    {
      description: 'Integrations page',
      path: 'theming/integration',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('[data-testid="change-theme"]');
      },
    },
  ],
};

export default suite;
