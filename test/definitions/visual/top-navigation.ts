// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Top navigation',
  componentName: 'top-navigation',
  tests: [
    {
      description: 'Responsiveness',
      path: 'top-navigation/screenshot',
      screenshotType: 'screenshotArea',
      configuration: { width: 1300 },
    },
    {
      description: 'Dropdown menu utility',
      path: 'top-navigation/scenario-full-page',
      screenshotType: 'viewport',
      configuration: { width: 1300, height: 800 },
      setup: async (page, wrapper) => {
        await page.click(wrapper.findTopNavigation().findUtility(4).toSelector());
      },
    },
    {
      description: 'Utility permutations',
      path: 'top-navigation/utility.permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Overflow menu - outer',
      path: 'top-navigation/scenario-full-page',
      screenshotType: 'viewport',
      configuration: { width: 500, height: 800 },
      setup: async (page, wrapper) => {
        await page.click(wrapper.findTopNavigation().findOverflowMenuButton().toSelector());
        await page.keys(['Tab']);
      },
    },
    {
      description: 'Overflow menu - dropdown',
      path: 'top-navigation/scenario-full-page',
      screenshotType: 'viewport',
      configuration: { width: 500, height: 800 },
      setup: async (page, wrapper) => {
        await page.click(wrapper.findTopNavigation().findOverflowMenuButton().toSelector());
        await page.click(wrapper.findTopNavigation().findOverflowMenu().findUtility(3).toSelector());
        await page.keys(['Tab']);
      },
    },
  ],
};

export default suite;
