// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Input',
  componentName: 'input',
  tests: [
    {
      description: 'permutations',
      path: 'input/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'style permutations',
      path: 'input/style-permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
