// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Alert',
  componentName: 'alert',
  tests: [
    {
      description: 'simple',
      path: 'alert/simple',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'style custom page',
      path: 'alert/style-custom-types',
      screenshotType: 'screenshotArea',
    },
    ...[600, 1280].map(width => ({
      description: `width ${width}px`,
      tests: [
        {
          configuration: { width },
          description: 'permutations',
          path: 'alert/permutations',
          screenshotType: 'permutations' as const,
        },
        {
          configuration: { width },
          description: 'custom types',
          path: 'alert/style-custom-types',
          screenshotType: 'screenshotArea' as const,
        },
      ],
    })),
  ],
};

export default suite;
