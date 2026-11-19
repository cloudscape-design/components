// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Table skeleton loading',
  componentName: 'table',
  tests: [
    {
      description: 'initial load with skeleton rows',
      path: 'table/skeleton-rows',
      screenshotType: 'screenshotArea',
      queryParams: { loadingState: 'skeleton', skeletonRows: '5' },
    },
    {
      description: 'progressive loading with data and skeleton rows',
      path: 'table/skeleton-rows',
      screenshotType: 'screenshotArea',
      queryParams: { loadingState: 'skeleton', skeletonRows: '5', dataRows: '3' },
    },
    {
      description: 'with selection column',
      path: 'table/skeleton-rows',
      screenshotType: 'screenshotArea',
      queryParams: { loadingState: 'skeleton', selectionMode: 'multi' },
    },
    {
      description: 'with striped rows',
      path: 'table/skeleton-rows',
      screenshotType: 'screenshotArea',
      queryParams: { loadingState: 'skeleton', stripedRows: 'true' },
    },
    {
      description: 'loading state spinner (deprecated)',
      path: 'table/skeleton-rows',
      screenshotType: 'screenshotArea',
      queryParams: { loadingState: 'loading' },
    },
  ],
};

export default suite;
