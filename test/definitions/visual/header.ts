// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Header',
  componentName: 'header',
  tests: [
    {
      description: 'level-1 at 1500px',
      path: 'header/level-1',
      screenshotType: 'screenshotArea',
      configuration: { width: 1500 },
    },
    {
      description: 'level-1 at 850px',
      path: 'header/level-1',
      screenshotType: 'screenshotArea',
      configuration: { width: 850 },
    },
    {
      description: 'level-1 at 400px',
      path: 'header/level-1',
      screenshotType: 'screenshotArea',
      configuration: { width: 400 },
    },
    {
      description: 'level-2 at 1500px',
      path: 'header/level-2',
      screenshotType: 'screenshotArea',
      configuration: { width: 1500 },
    },
    {
      description: 'level-2 at 850px',
      path: 'header/level-2',
      screenshotType: 'screenshotArea',
      configuration: { width: 850 },
    },
    {
      description: 'level-2 at 400px',
      path: 'header/level-2',
      screenshotType: 'screenshotArea',
      configuration: { width: 400 },
    },
    {
      description: 'level-3 at 1500px',
      path: 'header/level-3',
      screenshotType: 'screenshotArea',
      configuration: { width: 1500 },
    },
    {
      description: 'level-3 at 850px',
      path: 'header/level-3',
      screenshotType: 'screenshotArea',
      configuration: { width: 850 },
    },
    {
      description: 'level-3 at 400px',
      path: 'header/level-3',
      screenshotType: 'screenshotArea',
      configuration: { width: 400 },
    },
  ],
};

export default suite;
