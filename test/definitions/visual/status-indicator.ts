// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'StatusIndicator',
  componentName: 'status-indicator',
  tests: [
    {
      description: 'permutations',
      path: 'status-indicator/permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
