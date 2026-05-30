// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'AppLayout',
  componentName: 'app-layout',
  tests: [
    {
      description: 'no scrollbars at 320px',
      path: 'app-layout/default',
      screenshotType: 'screenshotArea',
      configuration: { width: 320 },
    },
    {
      description: 'drawer buttons alignment',
      path: 'app-layout/default',
      screenshotType: 'screenshotArea',
      configuration: { width: 800 },
      setup: async page => {
        await page.click('[aria-label="Open tools"]');
      },
    },
    {
      description: 'disable paddings - navigation closed',
      path: 'app-layout/disable-paddings',
      screenshotType: 'screenshotArea',
      configuration: { width: 1280 },
      setup: async page => {
        await page.click('[aria-label="Close navigation"]');
      },
    },
    {
      description: 'panels stacking on mobile',
      path: 'app-layout/all-panels-open',
      screenshotType: 'screenshotArea',
      configuration: { width: 600 },
    },
    {
      description: 'wrapping long words',
      path: 'app-layout/text-wrap',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'fill content area',
      path: 'app-layout/fill-content-area',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'with tools and drawers',
      path: 'app-layout/with-drawers',
      screenshotType: 'screenshotArea',
      queryParams: { hasTools: 'true' },
    },
    {
      description: 'with open drawer and open side split panel',
      path: 'app-layout/with-drawers',
      screenshotType: 'screenshotArea',
      configuration: { width: 1400 },
      queryParams: { splitPanelPosition: 'side' },
      setup: async page => {
        await page.click('[aria-label="Security trigger button"]');
        await page.click('[aria-label="Open panel"]');
      },
    },

    // regression for https://github.com/cloudscape-design/components/pull/1612
    {
      description: 'with open drawer and open side split panel after resize',
      path: 'app-layout/with-drawers',
      screenshotType: 'screenshotArea',
      configuration: { width: 1500 },
      queryParams: { splitPanelPosition: 'side' },
      setup: async page => {
        await page.click('[aria-label="Security trigger button"]');
        await page.click('[aria-label="Open panel"]');
        await page.setWindowSize({ width: 1400, height: 800 });
      },
    },

    // ── Transitions ───────────────────────────────────────────────────────
    {
      description: 'transition from 400px to 1800px',
      path: 'app-layout/default',
      screenshotType: 'screenshotArea',
      configuration: { width: 400, height: 400 },
      setup: async page => {
        await page.setWindowSize({ width: 1800, height: 400 });
      },
    },
    {
      description: 'transition from 1800px to 400px',
      path: 'app-layout/default',
      screenshotType: 'screenshotArea',
      configuration: { width: 1800, height: 400 },
      setup: async page => {
        await page.setWindowSize({ width: 400, height: 400 });
      },
    },
  ],
};

export default suite;
