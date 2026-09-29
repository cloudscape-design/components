// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Table',
  componentName: 'table',
  tests: [
    {
      description: 'multi-column sort permutations',
      path: 'table/multi-column-sort.permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
