// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'FormField',
  componentName: 'form-field',
  tests: [576, 768, 992, 1200].map<TestSuite>(width => ({
    description: `Layout at ${width}px`,
    tests: [
      {
        description: 'Permutations',
        path: 'form-field/permutations',
        screenshotType: 'permutations',
        configuration: { width },
      },
      {
        description: 'Scenarios',
        path: 'form-field/form-field-columns',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
    ],
  })),
};

export default suite;
