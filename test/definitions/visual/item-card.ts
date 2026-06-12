// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Item card',
  componentName: 'item-card',
  tests: [
    {
      description: 'permutations',
      path: 'item-card/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'padding permutations',
      path: 'item-card/padding-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'variant permutations',
      path: 'item-card/variant-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'style-custom',
      path: 'item-card/style-custom',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
