// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Tooltip',
  componentName: 'tooltip',
  tests: [
    {
      description: 'Style API v2 - tooltip visible',
      path: 'tooltip/style-api-v2',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.hoverElement('[aria-label="Copy"]');
      },
    },
  ],
};

export default suite;
