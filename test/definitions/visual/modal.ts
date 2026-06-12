// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Modal',
  componentName: 'modal',
  tests: [
    {
      description: 'simple',
      path: 'modal/simple',
      screenshotType: 'viewport',
      setup: async page => {
        await page.click('aria/Show modal');
      },
    },
    {
      description: 'no-paddings',
      path: 'modal/no-paddings',
      screenshotType: 'viewport',
      setup: async page => {
        await page.click('aria/Show modal');
      },
    },
    {
      description: 'vertical-scroll',
      path: 'modal/vertical-scroll',
      screenshotType: 'viewport',
      setup: async page => {
        await page.click('aria/Show modal');
      },
    },
    {
      description: 'long-header',
      path: 'modal/long-header',
      screenshotType: 'viewport',
      setup: async page => {
        await page.click('aria/Show modal');
      },
    },
    {
      description: 'unbreakable-header',
      path: 'modal/unbreakable-header',
      screenshotType: 'viewport',
      setup: async page => {
        await page.click('aria/Show modal');
      },
    },
    {
      description: 'size-small',
      path: 'modal/sizes',
      screenshotType: 'viewport',
      setup: async page => {
        await page.click('aria/small');
      },
    },
    {
      description: 'size-medium',
      path: 'modal/sizes',
      screenshotType: 'viewport',
      setup: async page => {
        await page.click('aria/medium');
      },
    },
    {
      description: 'size-large',
      path: 'modal/sizes',
      screenshotType: 'viewport',
      setup: async page => {
        await page.click('aria/large');
      },
    },
    {
      description: 'size-x-large',
      path: 'modal/sizes',
      screenshotType: 'viewport',
      setup: async page => {
        await page.click('aria/x-large');
      },
    },
    {
      description: 'size-xx-large',
      path: 'modal/sizes',
      screenshotType: 'viewport',
      setup: async page => {
        await page.click('aria/xx-large');
      },
    },
    {
      description: 'size-max',
      path: 'modal/sizes',
      screenshotType: 'viewport',
      setup: async page => {
        await page.click('aria/max');
      },
    },
    {
      description: 'position-top',
      path: 'modal/position-top',
      screenshotType: 'viewport',
      setup: async page => {
        await page.click('aria/Show modal');
      },
    },
    {
      description: 'custom-dimensions with footer',
      path: 'modal/custom-dimensions',
      screenshotType: 'viewport',
      queryParams: { width: '600', height: '400', footer: 'true' },
      setup: async page => {
        await page.click('[data-testid="modal-trigger"]');
      },
    },
    {
      description: 'custom-dimensions without footer',
      path: 'modal/custom-dimensions',
      screenshotType: 'viewport',
      queryParams: { width: '600', height: '400', footer: 'false' },
      setup: async page => {
        await page.click('[data-testid="modal-trigger"]');
      },
    },
    {
      description: 'custom-dimensions very small width',
      path: 'modal/custom-dimensions',
      screenshotType: 'viewport',
      queryParams: { width: '10' },
      setup: async page => {
        await page.click('[data-testid="modal-trigger"]');
      },
    },
    {
      description: 'custom-dimensions very small height with footer',
      path: 'modal/custom-dimensions',
      screenshotType: 'viewport',
      queryParams: { height: '10', footer: 'true' },
      setup: async page => {
        await page.click('[data-testid="modal-trigger"]');
      },
    },
    {
      description: 'custom-dimensions very small height & width with footer',
      path: 'modal/custom-dimensions',
      screenshotType: 'viewport',
      queryParams: { width: '10', height: '15', footer: 'true' },
      setup: async page => {
        await page.click('[data-testid="modal-trigger"]');
      },
    },
    {
      description: 'custom-dimensions large height & width with footer',
      path: 'modal/custom-dimensions',
      screenshotType: 'viewport',
      queryParams: { width: '10000', height: '10000', footer: 'true' },
      setup: async page => {
        await page.click('[data-testid="modal-trigger"]');
      },
    },
  ],
};

export default suite;
