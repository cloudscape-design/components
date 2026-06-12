// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'List',
  componentName: 'list',
  tests: [
    {
      description: 'permutations',
      path: 'list/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'sortable-permutations',
      path: 'list/sortable-permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
