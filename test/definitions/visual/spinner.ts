// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Spinner',
  componentName: 'spinner',
  tests: [
    {
      description: 'Alignment with text',
      path: 'spinner/text-align',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'Permutations',
      path: 'spinner/permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
