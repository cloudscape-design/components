// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Token',
  componentName: 'token',
  tests: [
    {
      description: 'Permutations',
      path: 'token/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Style permutations',
      path: 'token/style-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Style API v2',
      path: 'token/style-api-v2',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
