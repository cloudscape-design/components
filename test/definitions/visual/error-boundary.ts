// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'ErrorBoundary',
  componentName: 'error-boundary',
  tests: [
    {
      description: 'fallback states',
      path: 'error-boundary/error-boundary-fallbacks',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
