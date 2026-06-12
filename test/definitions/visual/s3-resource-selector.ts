// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'S3 Resource Selector',
  componentName: 's3-resource-selector',
  tests: [
    {
      description: 'Permutations',
      path: 's3-resource-selector/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Browse dialog - plain',
      path: 's3-resource-selector/permutations',
      screenshotType: 'viewport',
      configuration: { height: 1000 },
      setup: async page => {
        await page.click('button=Browse S3');
        await page.waitForVisible('[role="dialog"]');
      },
    },
    {
      description: 'Browse dialog - with alert',
      path: 's3-resource-selector/with-alert',
      screenshotType: 'viewport',
      configuration: { height: 1100 },
      setup: async page => {
        await page.click('button=Browse S3');
        await page.waitForVisible('[role="dialog"]');
      },
    },
  ],
};

export default suite;
