// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Grid',
  componentName: 'grid',
  tests: [
    {
      description: 'grid at "default"',
      path: 'grid',
      screenshotType: 'screenshotArea',
      configuration: { width: 400 },
    },
    {
      description: 'grid at "xs"',
      path: 'grid',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
    },
    {
      description: 'grid at "m"',
      path: 'grid',
      screenshotType: 'screenshotArea',
      configuration: { width: 1200 },
    },
    {
      description: 'grid at "l"',
      path: 'grid',
      screenshotType: 'screenshotArea',
      configuration: { width: 1400 },
    },
  ],
};

export default suite;
