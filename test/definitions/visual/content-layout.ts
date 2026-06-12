// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'ContentLayout',
  componentName: 'content-layout',
  tests: [
    {
      description: 'fill content area',
      path: 'content-layout/fill-content-area',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'standalone',
      path: 'content-layout/standalone',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'with absolute components',
      path: 'content-layout/with-absolute-components',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'form with form header',
      path: 'content-layout/with-header-toggles',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'form with content layout header',
      path: 'content-layout/with-header-toggles',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('[data-testid="toggle-form-header"] input');
        await page.click('[data-testid="toggle-content-layout"] input');
      },
    },
    {
      description: 'without header - at 1400 without breadcrumbs, without notifications, with overlap',
      path: 'content-layout/without-header',
      screenshotType: 'screenshotArea',
      configuration: { width: 1400 },
      queryParams: { hasBreadcrumbs: 'false', hasNotifications: 'false', disableOverlap: 'false' },
    },
    {
      description: 'without header - at 1400 with breadcrumbs, without notifications, with overlap',
      path: 'content-layout/without-header',
      screenshotType: 'screenshotArea',
      configuration: { width: 1400 },
      queryParams: { hasBreadcrumbs: 'true', hasNotifications: 'false', disableOverlap: 'false' },
    },
    {
      description: 'without header - at 1400 without breadcrumbs, with notifications, with overlap',
      path: 'content-layout/without-header',
      screenshotType: 'screenshotArea',
      configuration: { width: 1400 },
      queryParams: { hasBreadcrumbs: 'false', hasNotifications: 'true', disableOverlap: 'false' },
    },
    {
      description: 'without header - at 1400 with breadcrumbs, with notifications, with overlap',
      path: 'content-layout/without-header',
      screenshotType: 'screenshotArea',
      configuration: { width: 1400 },
      queryParams: { hasBreadcrumbs: 'true', hasNotifications: 'true', disableOverlap: 'false' },
    },
    {
      description: 'without header - at 1400 without breadcrumbs, without notifications, without overlap',
      path: 'content-layout/without-header',
      screenshotType: 'screenshotArea',
      configuration: { width: 1400 },
      queryParams: { hasBreadcrumbs: 'false', hasNotifications: 'false', disableOverlap: 'true' },
    },
    {
      description: 'without header - at 1400 with breadcrumbs, with notifications, without overlap',
      path: 'content-layout/without-header',
      screenshotType: 'screenshotArea',
      configuration: { width: 1400 },
      queryParams: { hasBreadcrumbs: 'true', hasNotifications: 'true', disableOverlap: 'true' },
    },
    {
      description: 'without header - at 600 without breadcrumbs, without notifications, with overlap',
      path: 'content-layout/without-header',
      screenshotType: 'screenshotArea',
      configuration: { width: 600 },
      queryParams: { hasBreadcrumbs: 'false', hasNotifications: 'false', disableOverlap: 'false' },
    },
    {
      description: 'without header - at 600 with breadcrumbs, with notifications, with overlap',
      path: 'content-layout/without-header',
      screenshotType: 'screenshotArea',
      configuration: { width: 600 },
      queryParams: { hasBreadcrumbs: 'true', hasNotifications: 'true', disableOverlap: 'false' },
    },
  ],
};

export default suite;
