// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Steps',
  componentName: 'steps',
  tests: [
    {
      description: 'permutations',
      path: 'steps/permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
