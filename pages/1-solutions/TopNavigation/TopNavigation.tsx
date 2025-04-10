// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { TopNavigation as CloudscapeTopNavigation } from '~components';
import Theme from '~components/theming/component';

import logo from './hodgkins-logo.svg';

export default function TopNavigation() {
  return (
    <Theme backgroundColor="#000000">
      <CloudscapeTopNavigation
        identity={{
          href: '#',
          title: 'Hodgkin',
          logo: {
            src: logo,
            alt: 'Hodgkin logo of an atom',
          },
        }}
        utilities={[
          {
            type: 'button',
            iconName: 'notification',
            title: 'Notifications',
            ariaLabel: 'Notifications (unread)',
            badge: true,
            disableUtilityCollapse: false,
          },
          {
            type: 'menu-dropdown',
            text: 'JK',
            description: 'email@example.com',
            iconName: 'user-profile',
            items: [
              { id: 'profile', text: 'Profile' },
              { id: 'preferences', text: 'Preferences' },
              { id: 'security', text: 'Security' },
              {
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
                  { id: 'support', text: 'Support' },
                  {
                    id: 'feedback',
                    text: 'Feedback',
                    href: '#',
                    external: true,
                    externalIconAriaLabel: ' (opens in new tab)',
                  },
                ],
              },
              { id: 'signout', text: 'Sign out' },
            ],
          },
        ]}
      />
    </Theme>
  );
}
