// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Drawer',
  componentName: 'drawer',
  tests: [
    {
      description: 'permutations',
      path: 'drawer/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'short content, with footer, short footer',
      path: 'app-layout/drawer-with-footer',
      screenshotType: 'viewport',
      queryParams: { longContent: 'false', longFooter: 'false', hasFooter: 'true' },
    },
    {
      description: 'short content, with footer, long footer',
      path: 'app-layout/drawer-with-footer',
      screenshotType: 'viewport',
      queryParams: { longContent: 'false', longFooter: 'true', hasFooter: 'true' },
    },
    {
      description: 'long content, with footer, short footer',
      path: 'app-layout/drawer-with-footer',
      screenshotType: 'viewport',
      queryParams: { longContent: 'true', longFooter: 'false', hasFooter: 'true' },
    },
    {
      description: 'long content, with footer, long footer',
      path: 'app-layout/drawer-with-footer',
      screenshotType: 'viewport',
      queryParams: { longContent: 'true', longFooter: 'true', hasFooter: 'true' },
    },
    {
      description: 'Drawer with small view height',
      path: 'app-layout/drawer-with-footer',
      screenshotType: 'viewport',
      configuration: { width: 1280, height: 268 },
      queryParams: { longContent: 'true', hasFooter: 'true', longFooter: 'true' },
    },
    {
      description: 'Drawer footer with small view height',
      path: 'app-layout/drawer-with-footer',
      screenshotType: 'viewport',
      configuration: { width: 1280, height: 268 },
      queryParams: { longContent: 'true', hasFooter: 'true' },
      setup: async ({ page, wrapper }) => {
        await (page as any).scrollIntoView(wrapper.findDrawer().findFooter().toSelector());
      },
    },
    {
      description: 'Drawer with absolute position',
      path: 'drawer/drawer-position-absolute',
      screenshotType: 'viewport',
      configuration: { width: 1200, height: 1000 },
    },
    {
      description: 'Drawer with absolute position and backdrops',
      path: 'drawer/drawer-position-absolute',
      screenshotType: 'viewport',
      configuration: { width: 1200, height: 1000 },
      queryParams: { backdrops: 'start,end' },
    },
    {
      description: 'Drawer with sticky position',
      path: 'drawer/drawer-position-sticky',
      screenshotType: 'viewport',
      configuration: { width: 1200, height: 1000 },
    },
    {
      description: 'Drawer with sticky position and offsets',
      path: 'drawer/drawer-position-sticky',
      screenshotType: 'viewport',
      configuration: { width: 1200, height: 1000 },
      queryParams: { offsets: 'true' },
    },
    {
      description: 'Drawer with sticky position and sticky offsets',
      path: 'drawer/drawer-position-sticky',
      screenshotType: 'viewport',
      configuration: { width: 1200, height: 1000 },
      queryParams: { stickyOffsets: 'true' },
    },
    {
      description: 'Drawer with fixed position',
      path: 'drawer/drawer-position-fixed',
      screenshotType: 'viewport',
      configuration: { width: 1200, height: 1000 },
    },
    {
      description: 'Drawer with fixed position, offsets and backdrop',
      path: 'drawer/drawer-position-fixed',
      screenshotType: 'viewport',
      configuration: { width: 1200, height: 1000 },
      queryParams: { offsets: 'true', backdrop: 'true' },
    },
  ],
};

export default suite;
