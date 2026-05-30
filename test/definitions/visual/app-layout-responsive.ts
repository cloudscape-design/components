// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

function responsiveTests(width: number): TestSuite {
  return {
    description: `width ${width}px`,
    componentName: 'app-layout',
    tests: [
      {
        description: 'default',
        path: 'app-layout/default',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'navigation drawer is open',
        path: 'app-layout/with-wizard',
        screenshotType: 'screenshotArea',
        configuration: { width },
        setup: async page => {
          await page.click('[aria-label="Open navigation"]');
        },
      },
      {
        description: 'wizard',
        path: 'app-layout/with-wizard',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'with wizard and table',
        path: 'app-layout/with-wizard-and-table',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'with wizard, table, and breadcrumbs',
        path: 'app-layout/with-wizard-and-table',
        screenshotType: 'screenshotArea',
        configuration: { width },
        queryParams: { hasBreadcrumbs: 'true' },
      },
      {
        description: 'notifications',
        path: 'app-layout/with-notifications',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'breadcrumbs',
        path: 'app-layout/with-breadcrumbs',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'notifications and breadcrumbs',
        path: 'app-layout/with-breadcrumbs-notifications',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'dashboard content type',
        path: 'app-layout/dashboard-content-type',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'fixed header and footer',
        path: 'app-layout/with-fixed-header-footer',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'disableBodyScroll - empty',
        path: 'app-layout/legacy-nav-empty',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'disableBodyScroll - with content',
        path: 'app-layout/legacy-nav-scrollable',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'disableBodyScroll - with split panel',
        path: 'app-layout/legacy-nav-scrollable-with-split-panel',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'disable paddings',
        path: 'app-layout/disable-paddings',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'disable paddings with breadcrumbs',
        path: 'app-layout/disable-paddings-breadcrumbs',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'sticky notifications',
        path: 'app-layout/with-sticky-notifications',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'sticky notifications scrolled down',
        path: 'app-layout/with-sticky-notifications',
        screenshotType: 'screenshotArea',
        configuration: { width },
        setup: async page => {
          await page.windowScrollTo({ top: 2000 });
        },
      },
      {
        description: 'layout without panels',
        path: 'app-layout/no-panels',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'layout without panels but with notifications',
        path: 'app-layout/no-panels-with-notifications',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'with drawers',
        path: 'app-layout/with-drawers',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'with empty drawers',
        path: 'app-layout/with-drawers-empty',
        screenshotType: 'screenshotArea',
        configuration: { width },
      },
      {
        description: 'with open drawer',
        path: 'app-layout/with-drawers',
        screenshotType: 'screenshotArea',
        configuration: { width },
        setup: async page => {
          await page.click('[aria-label="Security trigger button"]');
        },
      },
    ],
  };
}

const suite: TestSuite = {
  description: 'AppLayout responsive',
  componentName: 'app-layout',
  tests: [
    responsiveTests(600),
    responsiveTests(1280),
    responsiveTests(1400),
    responsiveTests(1920),
    responsiveTests(2540),
  ],
};

export default suite;
