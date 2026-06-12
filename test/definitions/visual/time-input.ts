// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Time Input',
  componentName: 'time-input',
  tests: [
    {
      description: 'Permutations',
      path: 'time-input/permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
