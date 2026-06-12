// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Table cells',
  componentName: 'table-cells',
  tests: [
    {
      description: 'vertical align',
      path: 'table/cell-permutations',
      screenshotType: 'screenshotArea',
      configuration: { width: 1200 },
      queryParams: { verticalAlignTop: 'true' },
    },
  ],
};

export default suite;
