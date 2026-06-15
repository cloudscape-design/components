// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Input from '~components/input';
import TopNavigation, { TopNavigationProps } from '~components/top-navigation';

import { SimplePage } from '../app/templates';
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

interface Permutation {
  label: string;
  props: TopNavigationProps;
}

const permutations: Permutation[] = [
  {
    label: 'Identity + search + utilities',
    props: { identity, search, utilities, i18nStrings: I18N_STRINGS },
  },
  {
    label: 'Identity + utilities (no search)',
    props: { identity, utilities, i18nStrings: I18N_STRINGS },
  },
  {
    label: 'Identity + search (no utilities)',
    props: { identity, search, i18nStrings: I18N_STRINGS },
  },
  {
    label: 'Identity only',
    props: { identity, i18nStrings: I18N_STRINGS },
  },
  {
    label: 'Utilities only (no identity)',
    props: { utilities, i18nStrings: I18N_STRINGS },
  },
  {
    label: 'Search + utilities (no identity)',
    props: { search, utilities, i18nStrings: I18N_STRINGS },
  },
  {
    label: 'Search only (no identity, no utilities)',
    props: { search, i18nStrings: I18N_STRINGS },
  },
  {
    label: 'Empty (no identity, no search, no utilities)',
    props: { i18nStrings: I18N_STRINGS },
  },
];

const visualContexts: Array<TopNavigationProps['visualContext']> = ['top-navigation', 'none'];

export default function OptionalPropsPermutations() {
  return (
    <SimplePage title="TopNavigation optional props permutations" screenshotArea={{}}>
      {visualContexts.map(visualContext => (
        <div key={visualContext} style={{ marginBottom: 32 }}>
          <h2>visualContext=&quot;{visualContext}&quot;</h2>
          {permutations.map(({ label, props }) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <h3>{label}</h3>
              <TopNavigation {...props} visualContext={visualContext} />
            </div>
          ))}
        </div>
      ))}
    </SimplePage>
  );
}
