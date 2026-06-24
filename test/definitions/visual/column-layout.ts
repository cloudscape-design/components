// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'ColumnLayout',
  componentName: 'column-layout',
  tests: [
    {
      description: 'column-layout at "default"',
      path: 'column-layout/simple',
      screenshotType: 'screenshotArea',
      configuration: { width: 400 },
    },
    {
      description: 'permutations at "default"',
      path: 'column-layout/permutations',
      screenshotType: 'permutations',
      configuration: { width: 400 },
    },
    {
      description: 'column-layout at "xxs"',
      path: 'column-layout/simple',
      screenshotType: 'screenshotArea',
      configuration: { width: 500 },
    },
    {
      description: 'permutations at "xxs"',
      path: 'column-layout/permutations',
      screenshotType: 'permutations',
      configuration: { width: 500 },
    },
    {
      description: 'column-layout at "xs"',
      path: 'column-layout/simple',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
    },
    {
      description: 'permutations at "xs"',
      path: 'column-layout/permutations',
      screenshotType: 'permutations',
      configuration: { width: 800 },
    },
    {
      description: 'column-layout at "m"',
      path: 'column-layout/simple',
      screenshotType: 'screenshotArea',
      configuration: { width: 1200 },
    },
    {
      description: 'permutations at "m"',
      path: 'column-layout/permutations',
      screenshotType: 'permutations',
      configuration: { width: 1200 },
    },
  ],
};

export default suite;
