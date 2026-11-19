// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Dialog',
  componentName: 'dialog',
  tests: [
    {
      description: 'permutations',
      path: 'dialog/permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
