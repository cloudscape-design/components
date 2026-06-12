// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Container sticky permutations',
  componentName: 'container',
  tests: [
    {
      description: 'simple - at 1400px',
      path: 'container/sticky-permutations',
      screenshotType: 'viewport',
      configuration: { width: 1400 },
      setup: async page => {
        await page.windowScrollTo({ top: 200 });
      },
    },
    {
      description: 'with notifications - at 1400px',
      path: 'container/sticky-permutations',
      screenshotType: 'viewport',
      configuration: { width: 1400 },
      queryParams: { hasNotifications: 'true' },
      setup: async page => {
        await page.windowScrollTo({ top: 200 });
      },
    },
    {
      description: 'with breadcrumbs - at 1400px',
      path: 'container/sticky-permutations',
      screenshotType: 'viewport',
      configuration: { width: 1400 },
      queryParams: { hasBreadcrumbs: 'true' },
      setup: async page => {
        await page.windowScrollTo({ top: 200 });
      },
    },
    {
      description: 'with an alert - at 1400px',
      path: 'container/sticky-permutations',
      screenshotType: 'viewport',
      configuration: { width: 1400 },
      queryParams: { hasNotifications: 'true', hasAlert: 'true' },
      setup: async page => {
        await page.windowScrollTo({ top: 200 });
      },
    },
    {
      description: 'with an alert - at 1400px without scroll',
      path: 'container/sticky-permutations',
      screenshotType: 'viewport',
      configuration: { width: 1400 },
      queryParams: { hasNotifications: 'true', hasAlert: 'true' },
    },
    {
      description: 'with high-contrast header - at 1400px',
      path: 'container/sticky-permutations',
      screenshotType: 'viewport',
      configuration: { width: 1400 },
      queryParams: { hasNotifications: 'true', highContrast: 'true' },
      setup: async page => {
        await page.windowScrollTo({ top: 200 });
      },
    },
    {
      description: 'simple - at 600px',
      path: 'container/sticky-permutations',
      screenshotType: 'viewport',
      configuration: { width: 600 },
      setup: async page => {
        await page.windowScrollTo({ top: 200 });
      },
    },
    {
      description: 'with notifications - at 600px',
      path: 'container/sticky-permutations',
      screenshotType: 'viewport',
      configuration: { width: 600 },
      queryParams: { hasNotifications: 'true' },
      setup: async page => {
        await page.windowScrollTo({ top: 200 });
      },
    },
    {
      description: 'with breadcrumbs - at 600px',
      path: 'container/sticky-permutations',
      screenshotType: 'viewport',
      configuration: { width: 600 },
      queryParams: { hasBreadcrumbs: 'true' },
      setup: async page => {
        await page.windowScrollTo({ top: 200 });
      },
    },
    {
      description: 'with an alert - at 600px',
      path: 'container/sticky-permutations',
      screenshotType: 'viewport',
      configuration: { width: 600 },
      queryParams: { hasNotifications: 'true', hasAlert: 'true' },
      setup: async page => {
        await page.windowScrollTo({ top: 200 });
      },
    },
    {
      description: 'with an alert - at 600px without scroll',
      path: 'container/sticky-permutations',
      screenshotType: 'viewport',
      configuration: { width: 600 },
      queryParams: { hasNotifications: 'true', hasAlert: 'true' },
    },
    {
      description: 'with high-contrast header - at 600px',
      path: 'container/sticky-permutations',
      screenshotType: 'viewport',
      configuration: { width: 600 },
      queryParams: { hasNotifications: 'true', highContrast: 'true' },
      setup: async page => {
        await page.windowScrollTo({ top: 200 });
      },
    },
  ],
};

export default suite;
