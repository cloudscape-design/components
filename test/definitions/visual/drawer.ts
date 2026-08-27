// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper from '../../../lib/components/test-utils/selectors';
import { TestDefinition, TestSuite } from '../types';

const wrapper = createWrapper();

const drawerFooterPermutations = [
  { longContent: 'true', longFooter: 'true', hasFooter: 'true' },
  { longContent: 'true', longFooter: 'false', hasFooter: 'true' },
  { longContent: 'false', longFooter: 'true', hasFooter: 'true' },
  { longContent: 'false', longFooter: 'false', hasFooter: 'true' },
];

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
      description: 'Drawer with Footer',
      tests: [
        ...drawerFooterPermutations.map<TestDefinition>(params => ({
          description: [
            'permutations',
            params.longContent === 'true' ? 'long content' : 'short content',
            params.hasFooter === 'true' && 'with footer',
            params.longFooter === 'true' && 'long footer',
          ]
            .filter(Boolean)
            .join(' - '),
          path: 'app-layout/drawer-with-footer',
          screenshotType: 'viewport',
          queryParams: params,
        })),
        {
          description: 'Drawer with small view height',
          path: 'app-layout/drawer-with-footer',
          screenshotType: 'viewport',
          configuration: { width: 1280, height: 268 },
          queryParams: {
            longContent: 'true',
            hasFooter: 'true',
            longFooter: 'true',
          },
        },
        {
          description: 'Drawer footer with small view height',
          path: 'app-layout/drawer-with-footer',
          screenshotType: 'viewport',
          configuration: { width: 1280, height: 268 },
          queryParams: {
            longContent: 'true',
            hasFooter: 'true',
          },
          setup: async ({ page }) => {
            await page.scrollIntoView(wrapper.findDrawer().findFooter().toSelector());
          },
        },
      ],
    },
    {
      description: 'Drawer layout',
      tests: [
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
    },
  ],
};

export default suite;
