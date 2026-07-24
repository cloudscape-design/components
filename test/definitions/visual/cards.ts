// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Cards',
  componentName: 'cards',
  tests: [2200, 1920, 1400, 1200, 992, 768].map(width => ({
    description: `permutations at ${width}`,
    path: 'cards/permutations',
    screenshotType: 'permutations' as const,
    configuration: { width },
  })),
};

export default suite;
