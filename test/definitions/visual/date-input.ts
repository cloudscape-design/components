// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Date input',
  componentName: 'date-input',
  tests: [
    {
      description: 'Permutations: states',
      path: 'date-input/permutations-states',
      screenshotType: 'permutations',
    },
    {
      description: 'Permutations: formats',
      path: 'date-input/permutations-formats',
      screenshotType: 'permutations',
    },
    {
      description: 'Style API v2',
      path: 'date-input/style-api-v2',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
