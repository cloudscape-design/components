// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const TEST_WIDTHS: [string, number][] = [
  ['default', 400],
  ['xxs', 500],
  ['xs', 800],
  ['m', 1200],
];

const suite: TestSuite = {
  description: 'ColumnLayout',
  componentName: 'column-layout',
  tests: TEST_WIDTHS.flatMap<TestDefinition>(([breakpoint, width]) => [
    {
      description: `column-layout at "${breakpoint}"`,
      path: 'column-layout/simple',
      screenshotType: 'screenshotArea' as const,
      configuration: { width },
    },
    {
      description: `permutations at "${breakpoint}"`,
      path: 'column-layout/permutations',
      screenshotType: 'permutations' as const,
      configuration: { width },
    },
  ]),
};

export default suite;
