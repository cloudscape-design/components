// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'SideNavigation',
  componentName: 'side-navigation',
  tests: [
    {
      description: 'Permutations',
      path: 'side-navigation/permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
