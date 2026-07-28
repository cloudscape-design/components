// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Drawers',
  componentName: 'app-layout',
  tests: [
    {
      description: 'popover can be displayed outside split panel',
      path: 'app-layout/with-full-page-table-and-split-panel',
      screenshotType: 'viewport',
      queryParams: { splitPanelPosition: 'side' },
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findPopover('[data-testid="split-panel"]').toSelector());
      },
    },
    {
      description: 'popover can be displayed outside help panel',
      path: 'app-layout/with-full-page-table-and-split-panel',
      screenshotType: 'viewport',
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findAppLayout().findToolsToggle().toSelector());
        await page.click(wrapper.findPopover('[data-testid="help-panel"]').toSelector());
      },
    },
    {
      description: 'with split panel',
      path: 'app-layout/with-drawers',
      screenshotType: 'viewport',
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findAppLayout().findDrawerTriggerById('pro-help').toSelector());
      },
    },
    {
      description: 'with tooltip on hover',
      path: 'app-layout/with-drawers',
      screenshotType: 'viewport',
      setup: async ({ page, wrapper }) => {
        await page.hoverElement(wrapper.findAppLayout().findDrawerTriggerById('pro-help').toSelector());
      },
    },
    {
      description: 'with custom scrollable drawer content',
      path: 'app-layout/with-drawers-scrollable',
      screenshotType: 'viewport',
      queryParams: { sideNavFill: 'false' },
      setup: async ({ page, wrapper }) => {
        await page.click(wrapper.findAppLayout().findDrawerTriggerById('chat').toSelector());
      },
    },
    {
      description: 'with full height drawer content',
      path: 'app-layout/with-drawers-scrollable',
      screenshotType: 'viewport',
      queryParams: { sideNavFill: 'true' },
      setup: async ({ page }) => {
        await page.click('[data-testid="open-global-drawer-button"]');
      },
    },
    {
      description: 'with only global drawers',
      path: 'app-layout/runtime-drawers-with-only-global',
      screenshotType: 'viewport',
    },
  ],
};

export default suite;
