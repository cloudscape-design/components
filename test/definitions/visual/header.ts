// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Header',
  componentName: 'header',
  tests: [1, 2, 3].flatMap<TestDefinition>(level =>
    [1500, 850, 400].map<TestDefinition>(width => ({
      description: `level-${level} at ${width}px`,
      path: `header/level-${level}`,
      screenshotType: 'screenshotArea',
      configuration: { width },
    }))
  ),
};

export default suite;
