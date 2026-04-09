// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ButtonGroup from '~components/button-group';
import NavigationBar from '~components/navigation-bar';

import ScreenshotArea from '../utils/screenshot-area';

export default function NavigationBarPage() {
  return (
    <main>
      <h1>Navigation Bar</h1>
      <ScreenshotArea>
        <h2>Primary — horizontal (default)</h2>
        <NavigationBar ariaLabel="Main navigation">
          <span style={{ color: 'white', fontWeight: 'bold' }}>My Product</span>
          <div style={{ marginInlineStart: 'auto' }}>
            <ButtonGroup
              variant="icon"
              ariaLabel="Utilities"
              items={[
                { type: 'icon-button', id: 'settings', iconName: 'settings', text: 'Settings' },
                { type: 'icon-button', id: 'user', iconName: 'user-profile', text: 'User' },
              ]}
            />
          </div>
        </NavigationBar>

        <h2>Secondary — horizontal</h2>
        <NavigationBar variant="secondary" ariaLabel="Page toolbar">
          <span>Breadcrumbs / Page title</span>
          <div style={{ marginInlineStart: 'auto' }}>
            <ButtonGroup
              variant="icon"
              ariaLabel="Actions"
              items={[{ type: 'icon-button', id: 'edit', iconName: 'edit', text: 'Edit' }]}
            />
          </div>
        </NavigationBar>

        <h2>Primary — vertical</h2>
        <div style={{ display: 'flex', blockSize: '200px' }}>
          <NavigationBar variant="primary" placement="vertical" ariaLabel="Side navigation">
            <ButtonGroup
              variant="icon"
              ariaLabel="Navigation"
              items={[
                { type: 'icon-button', id: 'home', iconName: 'angle-right', text: 'Home' },
                { type: 'icon-button', id: 'settings', iconName: 'settings', text: 'Settings' },
              ]}
            />
          </NavigationBar>
          <div style={{ padding: '16px' }}>Main content</div>
        </div>

        <h2>Secondary — vertical</h2>
        <div style={{ display: 'flex', blockSize: '200px' }}>
          <NavigationBar variant="secondary" placement="vertical" ariaLabel="Side toolbar">
            <ButtonGroup
              variant="icon"
              ariaLabel="Tools"
              items={[
                { type: 'icon-button', id: 'search', iconName: 'search', text: 'Search' },
                { type: 'icon-button', id: 'filter', iconName: 'filter', text: 'Filter' },
              ]}
            />
          </NavigationBar>
          <div style={{ padding: '16px' }}>Main content</div>
        </div>
      </ScreenshotArea>
    </main>
  );
}
