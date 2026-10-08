// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Control group',
  componentName: 'control-group',
  tests: [
    {
      description: 'Permutations',
      path: 'control-group/permutations',
      screenshotType: 'permutations',
      pixelDiffTolerance: 2,
    },
  ],
};

export default suite;
