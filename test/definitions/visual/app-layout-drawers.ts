// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Drawers',
  componentName: 'app-layout',
  tests: [
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
  ],
};

export default suite;
