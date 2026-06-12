// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'FormField',
  componentName: 'form-field',
  tests: [
    {
      description: 'Permutations at 576',
      path: 'form-field/permutations',
      screenshotType: 'permutations',
      configuration: { width: 576 },
    },
    {
      description: 'Scenarios at 576',
      path: 'form-field/form-field-columns',
      screenshotType: 'screenshotArea',
      configuration: { width: 576 },
    },
    {
      description: 'Permutations at 768',
      path: 'form-field/permutations',
      screenshotType: 'permutations',
      configuration: { width: 768 },
    },
    {
      description: 'Scenarios at 768',
      path: 'form-field/form-field-columns',
      screenshotType: 'screenshotArea',
      configuration: { width: 768 },
    },
    {
      description: 'Permutations at 992',
      path: 'form-field/permutations',
      screenshotType: 'permutations',
      configuration: { width: 992 },
    },
    {
      description: 'Scenarios at 992',
      path: 'form-field/form-field-columns',
      screenshotType: 'screenshotArea',
      configuration: { width: 992 },
    },
    {
      description: 'Permutations at 1200',
      path: 'form-field/permutations',
      screenshotType: 'permutations',
      configuration: { width: 1200 },
    },
    {
      description: 'Scenarios at 1200',
      path: 'form-field/form-field-columns',
      screenshotType: 'screenshotArea',
      configuration: { width: 1200 },
    },
  ],
};

export default suite;
