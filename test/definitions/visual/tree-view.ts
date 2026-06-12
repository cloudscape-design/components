// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Tree View',
  componentName: 'tree-view',
  tests: [
    {
      description: 'basic',
      path: 'tree-view/basic',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'with different toggle icon',
      path: 'tree-view/basic',
      screenshotType: 'screenshotArea',
      setup: async (page, wrapper) => {
        const select = wrapper.findSelect();
        await page.click(select.findTrigger().toSelector());
        await page.click(select.findDropdown().findOptionByValue('custom').toSelector());
      },
    },
  ],
};

export default suite;
