// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Table embedded',
  componentName: 'table-embedded',
  tests: [
    {
      description: 'in alert',
      path: 'table/embedded-in-alert',
      screenshotType: 'viewport',
    },
    {
      description: 'stacked and container variants',
      path: 'table/stacked-and-container-variant',
      screenshotType: 'viewport',
    },
  ],
};

export default suite;
