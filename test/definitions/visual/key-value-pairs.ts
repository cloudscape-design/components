// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Key-value pairs',
  componentName: 'key-value-pairs',
  tests: [
    {
      description: 'permutations',
      path: 'key-value-pairs/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'permutations on mobile (600px)',
      path: 'key-value-pairs/permutations',
      screenshotType: 'permutations',
      configuration: { width: 600 },
    },
    {
      description: 'wrapping text',
      path: 'key-value-pairs/text-wrap',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
