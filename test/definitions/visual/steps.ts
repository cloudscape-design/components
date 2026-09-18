// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Steps',
  componentName: 'steps',
  tests: [
    {
      description: 'permutations',
      path: 'steps/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'permutations custom steps',
      path: 'steps/permutations-custom-steps',
      screenshotType: 'permutations',
    },
    ...[320, 1280].map<TestSuite>(width => ({
      description: `width ${width}px`,
      tests: [
        {
          description: 'permutations with annotations',
          path: 'steps/permutations-annotation',
          screenshotType: 'permutations',
          configuration: { width },
        } as TestDefinition,
      ],
    })),
  ],
};

export default suite;
