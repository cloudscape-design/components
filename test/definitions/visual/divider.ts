// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Divider',
  componentName: 'divider',
  tests: [
    {
      description: 'permutations',
      path: 'divider/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Style API v2',
      path: 'divider/style-api-v2',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
