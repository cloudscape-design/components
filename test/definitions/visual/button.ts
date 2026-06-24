// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Button',
  componentName: 'button',
  tests: [
    {
      description: 'permutations',
      path: 'button/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'style-permutations',
      path: 'button/style-permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'style-custom-types',
      path: 'button/style-custom-types',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'external',
      path: 'button/external.permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'alignment',
      path: 'button/alignment',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'wrapping text',
      path: 'button/text-wrap',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'wrapping text with icon',
      path: 'button/with-icon-wrap',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'Button is focused',
      path: 'button/tab-navigation',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.click('#focusButton');
        await page.focusNextElement();
      },
    },
    {
      description: 'shows disabled reason tooltip on hover within modal',
      path: 'button/disabled-reason-modal',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.hoverElement('[data-testid="button"]');
      },
    },
    {
      description: 'shows disabled reason tooltip on hover over a button with an href',
      path: 'button/disabled-reason',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.hoverElement('[data-testid="normal-button-with-href"]');
      },
    },
  ],
};

export default suite;
