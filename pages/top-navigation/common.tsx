// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { TopNavigationProps } from '~components/top-navigation';

export const I18N_STRINGS: TopNavigationProps.I18nStrings = {
  searchIconAriaLabel: 'Search',
  searchDismissIconAriaLabel: 'Close search',
  overflowMenuBackIconAriaLabel: 'Back',
  overflowMenuDismissIconAriaLabel: 'Dismiss',
  overflowMenuTriggerText: 'More',
  overflowMenuTitleText: 'All',
};

export const profileActions = [
  { type: 'button', id: 'profile', text: 'Profile' },
  { type: 'button', id: 'preferences', text: 'Preferences' },
  { type: 'button', id: 'security', text: 'Security' },
  {
    type: 'menu-dropdown',
    id: 'support-group',
    text: 'Support',
    items: [
      {
        id: 'documentation',
        text: 'Documentation',
        href: '#',
        external: true,
        externalIconAriaLabel: ' (opens in new tab)',
      },
      { id: 'feedback', text: 'Feedback', href: '#', external: true, externalIconAriaLabel: ' (opens in new tab)' },
      { id: 'support', text: 'Customer support' },
    ],
  },
  { type: 'button', id: 'signout', text: 'Sign out' },
];

interface ViewPortProps {
  width?: number;
  height?: number;
  children: React.ReactNode;
}

export const ViewPort: React.FC<ViewPortProps> = ({ width, height, children }) => (
  <div style={{ width, height, boxSizing: 'border-box' }}>{children}</div>
);

export const MobileViewPort: React.FC<ViewPortProps> = ({ width = 360, height = 600, children }) => (
  <ViewPort width={width} height={height}>
    {children}
  </ViewPort>
);
