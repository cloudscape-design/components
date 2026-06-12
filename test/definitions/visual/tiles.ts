// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Tiles',
  componentName: 'tiles',
  tests: [
    {
      description: 'tiles at "${breakpoint}"',
      path: 'tiles/simple',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'permutations at "${breakpoint}"',
      path: 'tiles/permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
