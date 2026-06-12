// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'File token group',
  componentName: 'file-token-group',
  tests: [
    {
      description: 'Permutations',
      path: 'file-token-group/permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
