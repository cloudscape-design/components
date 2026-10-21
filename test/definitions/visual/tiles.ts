// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const TEST_WIDTHS: Array<[string, number]> = [
  ['default', 400],
  ['xxs', 600],
  ['xs', 800],
  ['m', 1200],
];

const suite: TestSuite = {
  description: 'Tiles',
  componentName: 'tiles',
  tests: TEST_WIDTHS.flatMap<TestDefinition>(([breakpoint, width]) => [
    {
      description: `tiles at "${breakpoint}"`,
      path: 'tiles/simple',
      screenshotType: 'screenshotArea',
      configuration: { width },
    },
    {
      description: `permutations at "${breakpoint}"`,
      path: 'tiles/permutations',
      screenshotType: 'permutations',
      configuration: { width },
    },
  ]),
};

export default suite;
