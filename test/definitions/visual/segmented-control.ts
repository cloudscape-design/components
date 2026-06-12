// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'SegmentedControl',
  componentName: 'segmented-control',
  tests: [
    {
      description: 'Permutations',
      path: 'segmented-control/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Style Permutations',
      path: 'segmented-control/style-permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
