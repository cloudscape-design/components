// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import VisualContext from '~components/internal/components/visual-context';
import OverflowMenu from '~components/top-navigation/parts/overflow-menu';

import { MobileViewPort, profileActions } from './common';

export default function TopNavigationOverflowMenuPage() {
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);

  return (
    <article style={{ margin: 24 }}>
      <h1>Top Navigation Overflow menu</h1>
      <button onClick={() => setShowOverflowMenu(true)}>Show</button>
      {showOverflowMenu && (
        <VisualContext contextName="top-navigation">
          <MobileViewPort>
            <OverflowMenu
              headerText="All"
              dismissIconAriaLabel="Close"
              backIconAriaLabel="Back"
              items={[
                {
                  type: 'button',
                  variant: 'link',
                  external: true,
                  text: 'AWS',
                  href: 'https://console.aws.amazon.com/',
                },
                { type: 'button', iconName: 'settings', title: 'Settings', ariaLabel: 'Settings' },
                {
                  type: 'menu-dropdown',
                  text: 'Customer name',
                  description: 'customer@example.com',
                  iconName: 'user-profile',
                  items: profileActions,
                },
              ]}
            />
          </MobileViewPort>
        </VisualContext>
      )}
    </article>
  );
}
