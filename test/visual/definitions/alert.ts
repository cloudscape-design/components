// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'alert',
  tests: [
    {
      description: 'permutations',
      path: 'alert/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'simple',
      path: 'alert/simple',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'custom types',
      path: 'alert/style-custom-types',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
