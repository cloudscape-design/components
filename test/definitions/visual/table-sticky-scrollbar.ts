// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Table sticky scrollbar',
  componentName: 'table-sticky-scrollbar',
  tests: [
    {
      description: 'on a plain page is positioned at the bottom',
      path: 'table/sticky-scrollbar',
      screenshotType: 'screenshotArea',
      configuration: { width: 600, height: 800 },
    },
    {
      description: 'on a page with app layout is positioned over the footer',
      path: 'app-layout/with-table',
      screenshotType: 'screenshotArea',
      configuration: { width: 600, height: 800 },
    },
    {
      description: 'on a page with app layout in a container is positioned over the bottom of the container',
      path: 'app-layout/with-table-in-container',
      screenshotType: 'screenshotArea',
      configuration: { width: 600, height: 800 },
    },
  ],
};

export default suite;
