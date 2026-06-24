// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'HelpPanel',
  componentName: 'help-panel',
  tests: [
    {
      description: 'permutations',
      path: 'help-panel/permutations',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'with AppLayout',
      path: 'help-panel/with-app-layout',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'loading state - with AppLayout',
      path: 'help-panel/loading-with-app-layout',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
