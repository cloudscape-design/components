// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Tabs',
  componentName: 'tabs',
  tests: [
    {
      description: 'Permutations',
      path: 'tabs/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Responsive permutations',
      path: 'tabs/responsive-permutations',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'focuses next tab header after clicking on tab header without an href',
      path: 'tabs/integration-test',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('#first-tabs li:nth-child(3) button');
        await page.keys('ArrowRight');
      },
    },
    {
      description: 'layout at ${width}px',
      path: 'tabs/integration-test',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'focus active tab - default variant',
      path: 'tabs/integration-test',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('#click-this');
        await page.focusNextElement();
      },
    },
    {
      description: 'focus active tab - container variant',
      path: 'tabs/integration-test',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('#click-this-2');
        await page.focusNextElement();
      },
    },
    {
      description: 'focus content - default variant',
      path: 'tabs/integration-test',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('#click-this');
        await page.focusNextElement();
        await page.focusNextElement();
      },
    },
    {
      description: 'focus content - container variant',
      path: 'tabs/integration-test',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('#click-this-2');
        await page.focusNextElement();
        await page.focusNextElement();
      },
    },
    {
      description: 'Style Permutations',
      path: 'tabs/style-permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
