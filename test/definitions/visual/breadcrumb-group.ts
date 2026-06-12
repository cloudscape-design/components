// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'BreadcrumbGroup',
  componentName: 'breadcrumb-group',
  tests: [
    {
      description: 'layout at 300px',
      path: 'breadcrumb-group/scenarios',
      screenshotType: 'screenshotArea',
      configuration: { width: 300 },
    },
    {
      description: 'layout at 680px',
      path: 'breadcrumb-group/scenarios',
      screenshotType: 'screenshotArea',
      configuration: { width: 680 },
    },
    {
      description: 'layout at 1200px',
      path: 'breadcrumb-group/scenarios',
      screenshotType: 'screenshotArea',
      configuration: { width: 1200 },
    },
    {
      description: 'dropdown',
      path: 'breadcrumb-group/scenarios',
      screenshotType: 'viewport',
      configuration: { width: 300, height: 1000 },
      setup: async (page, wrapper) => {
        await page.click(wrapper.findBreadcrumbGroup('[data-testid="breadcrumbs-6"]').findDropdown().toSelector());
      },
    },
    {
      description: 'responsive behavior',
      path: 'breadcrumb-group/responsive',
      screenshotType: 'screenshotArea',
      configuration: { width: 1200 },
    },
  ],
};

export default suite;
