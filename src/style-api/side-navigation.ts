// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { iconVars } from './icon';
import { focusOutlineVars } from './shared';
import { StyleAPI } from './types';

export const sideNavigationStyleDictionary = {
  classNames: {
    root: 'awsui-style-side-navigation-root',
    header: 'awsui-style-side-navigation-header',
    group: 'awsui-style-side-navigation-group',
    groupHeader: 'awsui-style-side-navigation-group-header',
    expandableGroup: 'awsui-style-side-navigation-expandable-group',
    divider: 'awsui-style-side-navigation-divider',
    link: 'awsui-style-side-navigation-link',
  },
};

const styleApi: StyleAPI = {
  variables: [],
  selectors: [
    {
      className: sideNavigationStyleDictionary.classNames.root,
      description: 'Root element of the side navigation.',
    },
    {
      className: sideNavigationStyleDictionary.classNames.header,
      description: 'Header link of the side navigation.',
      tags: ['a'],
      variables: [...focusOutlineVars, ...iconVars],
    },
    {
      className: sideNavigationStyleDictionary.classNames.group,
      description: 'Non-expandable section or link group.',
    },
    {
      className: sideNavigationStyleDictionary.classNames.groupHeader,
      description: 'Header text of a section or link group.',
      variables: [...focusOutlineVars],
    },
    {
      className: sideNavigationStyleDictionary.classNames.expandableGroup,
      description: 'Expandable section or expandable link group.',
    },
    {
      className: sideNavigationStyleDictionary.classNames.divider,
      description: 'Horizontal divider between navigation items.',
      tags: ['hr'],
    },
    {
      className: sideNavigationStyleDictionary.classNames.link,
      description: 'Navigation link.',
      tags: ['a'],
      variables: [...focusOutlineVars, ...iconVars],
    },
  ],
};

export default styleApi;
