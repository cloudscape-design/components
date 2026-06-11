// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Action card',
  componentName: 'action-card',
  tests: [
    {
      description: 'permutations',
      path: 'action-card/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'variant permutations',
      path: 'action-card/variant-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'padding permutations',
      path: 'action-card/padding-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'simple',
      path: 'action-card/simple',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
