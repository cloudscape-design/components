// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Pagination',
  componentName: 'pagination',
  tests: [
    {
      description: 'permutations',
      path: 'pagination/permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
