// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { iconVars } from './icon';
import { focusOutlineVars } from './shared';
import { StyleAPI } from './types';

export const appLayoutToolbarStyleDictionary = {
  classNames: {
    sideNavTrigger: 'awsui-style-app-layout-toolbar-side-nav-trigger',
    drawerTrigger: 'awsui-style-app-layout-toolbar-drawer-trigger',
    breadcrumbs: 'awsui-style-app-layout-toolbar-breadcrumbs',
  },
};

const styleApi: StyleAPI = {
  variables: [],
  selectors: [
    {
      className: appLayoutToolbarStyleDictionary.classNames.sideNavTrigger,
      description: 'Side navigation trigger button.',
      tags: ['button'],
      variables: [...focusOutlineVars, ...iconVars],
    },
    {
      className: appLayoutToolbarStyleDictionary.classNames.drawerTrigger,
      description: 'Drawer trigger button.',
      tags: ['button'],
      variables: [...focusOutlineVars, ...iconVars],
    },
    {
      className: appLayoutToolbarStyleDictionary.classNames.breadcrumbs,
      description: 'Breadcrumbs slot. Use it in combination with Breadcrumbs component selectors',
    },
  ],
};

export default styleApi;
