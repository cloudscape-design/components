// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Badge',
  componentName: 'badge',
  tests: [
    {
      description: 'permutation page',
      path: 'badge/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'style custom page',
      path: 'badge/style-custom-types',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
