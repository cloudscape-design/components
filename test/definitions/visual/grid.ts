// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const TEST_WIDTHS: [string, number][] = [
  ['default', 400],
  ['xs', 800],
  ['m', 1200],
  ['l', 1400],
];

const suite: TestSuite = {
  description: 'Grid',
  componentName: 'grid',
  tests: TEST_WIDTHS.map<TestDefinition>(([breakpoint, width]) => ({
    description: `grid at "${breakpoint}"`,
    path: 'grid',
    screenshotType: 'screenshotArea',
    configuration: { width },
  })),
};

export default suite;
