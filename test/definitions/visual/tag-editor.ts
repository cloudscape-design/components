// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'TagEditor',
  componentName: 'tag-editor',
  tests: [400, 600, 1280].map<TestSuite>(width => ({
    description: `width ${width}px`,
    tests: [
      {
        description: 'Permutations',
        path: 'tag-editor/permutations',
        screenshotType: 'permutations',
        configuration: { width },
      } as TestDefinition,
    ],
  })),
};

export default suite;
