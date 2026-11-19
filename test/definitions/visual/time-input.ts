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
    {
      description: 'Style API v2',
      path: 'time-input/style-api-v2',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
