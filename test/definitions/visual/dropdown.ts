// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Dropdown',
  componentName: 'dropdown',
  tests: [
    {
      description: 'In fixed container',
      path: 'dropdown/fixed-container',
      screenshotType: 'viewport',
      setup: async page => {
        const { height: windowHeight } = await page.getViewportSize();
        await page.windowScrollTo({ top: windowHeight });
        await page.click('button=Open dropdown');
      },
    },
    {
      description: 'positions select inside modal, expandToViewport=false',
      path: 'dropdown/expandable',
      screenshotType: 'viewport',
      queryParams: { componentType: 'Select', expandToViewport: 'false' },
      setup: async page => {
        await page.click('#show-modal');
        await page.click('#in-modal');
      },
    },
    {
      description: 'positions select inside modal, expandToViewport=true',
      path: 'dropdown/expandable',
      screenshotType: 'viewport',
      queryParams: { componentType: 'Select', expandToViewport: 'true' },
      setup: async page => {
        await page.click('#show-modal');
        await page.click('#in-modal');
      },
    },
    {
      description: 'positions select inside popover, expandToViewport=false',
      path: 'dropdown/expandable',
      screenshotType: 'viewport',
      queryParams: { componentType: 'Select', expandToViewport: 'false' },
      setup: async page => {
        await page.click('#show-popover');
        await page.click('#in-popover');
        await page.click('[data-test-index="5"]');
      },
    },
    {
      description: 'positions select inside popover, expandToViewport=true',
      path: 'dropdown/expandable',
      screenshotType: 'viewport',
      queryParams: { componentType: 'Select', expandToViewport: 'true' },
      setup: async page => {
        await page.click('#show-popover');
        await page.click('#in-popover');
        await page.click('[data-test-index="5"]');
      },
    },
    {
      description: 'select has bottom borders when opened upwards, expandToViewport=false',
      path: 'dropdown/expandable',
      screenshotType: 'viewport',
      queryParams: { componentType: 'Select', expandToViewport: 'false' },
      setup: async page => {
        await page.click('#bottom-left');
      },
    },
    {
      description: 'select has bottom borders when opened upwards, expandToViewport=true',
      path: 'dropdown/expandable',
      screenshotType: 'viewport',
      queryParams: { componentType: 'Select', expandToViewport: 'true' },
      setup: async page => {
        await page.click('#bottom-left');
      },
    },
  ],
};

export default suite;
