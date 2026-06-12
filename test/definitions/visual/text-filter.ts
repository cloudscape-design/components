// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'TextFilter',
  componentName: 'text-filter',
  tests: [
    {
      description: 'permutations',
      path: 'text-filter/permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
