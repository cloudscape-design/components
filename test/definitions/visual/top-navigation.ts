// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

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
      setup: async ({ page, wrapper }) => {
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
      setup: async ({ page, wrapper }) => {
        // Activate overflow menu
        await page.click(wrapper.findTopNavigation().findOverflowMenuButton().toSelector());
        // Activate focus ring to capture any issues with styles
        await page.keys(['Tab']);
      },
    },
    {
      description: 'Overflow menu - dropdown',
      path: 'top-navigation/scenario-full-page',
      screenshotType: 'viewport',
      configuration: { width: 500, height: 800 },
      setup: async ({ page, wrapper }) => {
        const topNavigation = wrapper.findTopNavigation();
        // Activate overflow menu
        await page.click(topNavigation.findOverflowMenuButton().toSelector());
        // Click on the last utility
        await page.click(topNavigation.findOverflowMenu().findUtility(3).toSelector());
        // Activate focus ring to capture any issues with styles
        await page.keys(['Tab']);
      },
    },
    ...[1300, 600].flatMap<TestDefinition>(width => [
      {
        description: `Custom content permutations at ${width}px`,
        path: 'top-navigation/custom-content.permutations',
        screenshotType: 'permutations',
        configuration: { width },
      },
      {
        description: `Optional props permutations at ${width}px`,
        path: 'top-navigation/optional-props.permutations',
        screenshotType: 'permutations',
        configuration: { width },
      },
    ]),
  ],
};

export default suite;
