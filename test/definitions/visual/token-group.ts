// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'TokenGroup',
  componentName: 'token-group',
  tests: [
    {
      description: 'Permutations',
      path: 'token-group/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Simple',
      path: 'token-group/index',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
