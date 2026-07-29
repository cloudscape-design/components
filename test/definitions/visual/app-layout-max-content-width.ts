// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'AppLayout',
  componentName: 'app-layout',
  tests: [
    {
      description: 'maxContentWidth',
      visualRefreshOnly: true,
      tests: [
        {
          description: 'maxContentWidth set to Number.MAX_VALUE',
          path: 'app-layout/refresh-content-width',
          screenshotType: 'viewport',
          configuration: { width: 1280, height: 700 },
          setup: async ({ page }) => {
            await page.click('[data-test-id="button_width-number-max_value"]');
          },
        },
      ],
    },
  ],
};

export default suite;
