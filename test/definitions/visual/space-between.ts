// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'SpaceBetween',
  componentName: 'space-between',
  tests: [
    {
      description: 'Permutations',
      path: 'space-between/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'in ColumnLayout and Grid',
      path: 'space-between/nested-components',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'Alignment permutations',
      path: 'space-between/alignment.permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
