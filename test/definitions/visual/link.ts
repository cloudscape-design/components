// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Link',
  componentName: 'link',
  tests: [
    {
      description: 'Permutations',
      path: 'link/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Permutations (long label)',
      path: 'link/long-label-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Icon overflow permutations',
      path: 'link/icon-overflow-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Inherit font size permutations',
      path: 'link/inherit-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Style custom page',
      path: 'link/style-custom-types',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
