// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Cards',
  componentName: 'cards',
  tests: [
    {
      description: 'permutations at 2200',
      path: 'cards/permutations',
      screenshotType: 'permutations',
      configuration: { width: 2200 },
    },
    {
      description: 'permutations at 1920',
      path: 'cards/permutations',
      screenshotType: 'permutations',
      configuration: { width: 1920 },
    },
    {
      description: 'permutations at 1400',
      path: 'cards/permutations',
      screenshotType: 'permutations',
      configuration: { width: 1400 },
    },
    {
      description: 'permutations at 1200',
      path: 'cards/permutations',
      screenshotType: 'permutations',
      configuration: { width: 1200 },
    },
    {
      description: 'permutations at 992',
      path: 'cards/permutations',
      screenshotType: 'permutations',
      configuration: { width: 992 },
    },
    {
      description: 'permutations at 768',
      path: 'cards/permutations',
      screenshotType: 'permutations',
      configuration: { width: 768 },
    },
  ],
};

export default suite;
