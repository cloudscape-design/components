// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import createWrapper from '../../../lib/components/test-utils/selectors';
import { TestSuite } from '../types';

const wrapper = createWrapper();

const suite: TestSuite = {
  description: 'Drawers',
  componentName: 'app-layout',
  tests: [
    {
      description: 'with split panel',
      path: 'app-layout/with-drawers',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click(wrapper.findAppLayout().findDrawerTriggerById('pro-help').toSelector());
      },
    },
    {
      description: 'with tooltip on hover',
      path: 'app-layout/with-drawers',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.hoverElement(wrapper.findAppLayout().findDrawerTriggerById('pro-help').toSelector());
      },
    },
    {
      description: 'with custom scrollable drawer content',
      path: 'app-layout/with-drawers-scrollable',
      screenshotType: 'screenshotArea',
      queryParams: { sideNavFill: 'false' },
      setup: async page => {
        await page.click(wrapper.findAppLayout().findDrawerTriggerById('chat').toSelector());
      },
    },
  ],
};

export default suite;
