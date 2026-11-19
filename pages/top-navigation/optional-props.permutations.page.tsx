// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Input from '~components/input';
import TopNavigation, { TopNavigationProps } from '~components/top-navigation';

import { SimplePage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { I18N_STRINGS } from './common';
import logo from './logos/simple-logo.svg';

const utilities: TopNavigationProps['utilities'] = [
  { type: 'button', iconName: 'notification', ariaLabel: 'Notifications', badge: true },
  { type: 'button', text: 'Settings', iconName: 'settings' },
  {
    type: 'menu-dropdown',
    text: 'Jane Doe',
    description: 'jane.doe@example.com',
    iconName: 'user-profile',
    items: [
      { id: 'profile', text: 'Profile' },
      { id: 'signout', text: 'Sign out' },
    ],
  },
];

const identity: TopNavigationProps['identity'] = {
  href: '#',
  title: 'My Service',
  logo: { src: logo, alt: 'Logo' },
};

const search = <Input type="search" placeholder="Search..." value="" onChange={() => {}} ariaLabel="Search" />;

const contentPermutations: Record<string, TopNavigationProps> = {
  'Identity + search + utilities': { identity, search, utilities, i18nStrings: I18N_STRINGS },
  'Identity + utilities (no search)': { identity, utilities, i18nStrings: I18N_STRINGS },
  'Identity + search (no utilities)': { identity, search, i18nStrings: I18N_STRINGS },
  'Identity only': { identity, i18nStrings: I18N_STRINGS },
  'Utilities only (no identity)': { utilities, i18nStrings: I18N_STRINGS },
  'Search + utilities (no identity)': { search, utilities, i18nStrings: I18N_STRINGS },
  'Search only (no identity, no utilities)': { search, i18nStrings: I18N_STRINGS },
  'Empty (no identity, no search, no utilities)': { i18nStrings: I18N_STRINGS },
};

const permutations = createPermutations<{ visualContext: TopNavigationProps['visualContext']; label: string }>([
  {
    visualContext: ['top-navigation', 'none'],
    label: Object.keys(contentPermutations),
  },
]);

export default function OptionalPropsPermutations() {
  return (
    <SimplePage title="TopNavigation optional props permutations" screenshotArea={{}}>
      <PermutationsView
        permutations={permutations}
        render={({ visualContext, label }) => (
          <div style={{ marginBottom: 16 }}>
            <h2>
              visualContext=&quot;{visualContext}&quot; — {label}
            </h2>
            <TopNavigation {...contentPermutations[label]} visualContext={visualContext} />
          </div>
        )}
      />
    </SimplePage>
  );
}
