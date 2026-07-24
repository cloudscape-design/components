// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'FormField',
  componentName: 'form-field',
  tests: [576, 768, 992, 1200].flatMap<TestDefinition>(width => [
    {
      description: `Permutations at ${width}px`,
      path: 'form-field/permutations',
      screenshotType: 'permutations' as const,
      configuration: { width },
    },
    {
      description: `Scenarios at ${width}px`,
      path: 'form-field/form-field-columns',
      screenshotType: 'screenshotArea' as const,
      configuration: { width },
    },
  ]),
};

export default suite;
