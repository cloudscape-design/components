// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Multiple instances',
  componentName: 'app-layout',
  tests: [600, 1280].flatMap(width => [
    {
      description: `simple (${width}px)`,
      path: 'app-layout/multi-layout-simple',
      screenshotType: 'viewport' as const,
      configuration: { width },
    },
    {
      description: `iframe (${width}px)`,
      path: 'app-layout/multi-layout-iframe',
      screenshotType: 'viewport' as const,
      configuration: { width },
    },
  ]),
};

export default suite;
