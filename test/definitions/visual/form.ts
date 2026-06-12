// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Form',
  componentName: 'form',
  tests: [
    {
      description: 'permutations',
      path: 'form/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'simple',
      path: 'form/simple',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
