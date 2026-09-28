// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Skeleton',
  componentName: 'skeleton',
  tests: [
    {
      description: 'permutations',
      path: 'skeleton/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'components examples',
      path: 'skeleton/components-examples',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
