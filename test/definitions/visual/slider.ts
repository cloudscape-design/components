// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Slider',
  componentName: 'slider',
  tests: [
    {
      description: 'permutations - standalone',
      path: 'slider/permutations',
      screenshotType: 'permutations',
      configuration: { width: 800 },
    },
    {
      description: 'Style API v2',
      path: 'slider/style-api-v2',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
