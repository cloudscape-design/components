// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'ProgressBar',
  componentName: 'progress-bar',
  tests: [
    {
      description: 'permutations - standalone',
      path: 'progress-bar/permutations-standalone',
      screenshotType: 'permutations',
      configuration: { width: 800 },
    },
    {
      description: 'permutations - flash',
      path: 'progress-bar/permutations-flash',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
    },
    {
      description: 'permutations - key-value',
      path: 'progress-bar/permutations-key-value',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
    },
  ],
};

export default suite;
