// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';

// Primary horizontal — app header with branding, nav links, and user menu
export const primaryHorizontalContent = (
  <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '8px 20px' }}>
    <SpaceBetween size="m" direction="horizontal" alignItems="center">
      <Link href="#" fontSize="heading-m">
        CloudManager
      </Link>
      <Link href="#">Services</Link>
      <Link href="#">Resources</Link>
      <Link href="#">Monitoring</Link>
    </SpaceBetween>
    <div style={{ marginInlineStart: 'auto' }}>
      <SpaceBetween size="xs" direction="horizontal" alignItems="center">
        <Button iconName="notification" variant="icon" ariaLabel="Notifications" />
        <ButtonDropdown
          items={[
            { id: 'profile', text: 'Profile' },
            { id: 'preferences', text: 'Preferences' },
            { id: 'signout', text: 'Sign out' },
          ]}
        >
          jane@example.com
        </ButtonDropdown>
      </SpaceBetween>
    </div>
  </div>
);

// Secondary horizontal — toolbar with breadcrumbs and actions
export const secondaryHorizontalContent = (
  <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '4px 20px' }}>
    <SpaceBetween size="xs" direction="horizontal" alignItems="center">
      <Button iconName="menu" variant="icon" ariaLabel="Toggle navigation" />
      <Box variant="span" fontSize="body-s">
        Home / Projects / my-service
      </Box>
    </SpaceBetween>
    <div style={{ marginInlineStart: 'auto' }}>
      <SpaceBetween size="xxs" direction="horizontal">
        <Button iconName="refresh" variant="icon" ariaLabel="Refresh" />
        <Button iconName="settings" variant="icon" ariaLabel="Settings" />
      </SpaceBetween>
    </div>
  </div>
);

// Primary vertical — branded sidebar that mirrors the horizontal header structure
// (brand, nav items, user menu) in a compact icon-only "shrunken" form.
export const primaryVerticalContent = (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      padding: '12px 8px',
      boxSizing: 'border-box',
      gap: '8px',
    }}
  >
    <Box fontWeight="bold" fontSize="heading-s" padding={{ vertical: 'xs' }}>
      Logo
    </Box>
    <SpaceBetween size="xs" direction="vertical" alignItems="center">
      <Button iconName="grid-view" variant="icon" ariaLabel="Services" />
      <Button iconName="folder" variant="icon" ariaLabel="Resources" />
      <Button iconName="view-horizontal" variant="icon" ariaLabel="Monitoring" />
    </SpaceBetween>
    <div style={{ marginBlockStart: 'auto' }}>
      <SpaceBetween size="xs" direction="vertical" alignItems="center">
        <Button iconName="notification" variant="icon" ariaLabel="Notifications" />
        <ButtonDropdown
          variant="icon"
          ariaLabel="User menu"
          items={[
            { id: 'profile', text: 'Profile' },
            { id: 'preferences', text: 'Preferences' },
            { id: 'signout', text: 'Sign out' },
          ]}
        />
      </SpaceBetween>
    </div>
  </div>
);

// Secondary vertical — tool rail with actions
export const secondaryVerticalContent = (
  <SpaceBetween size="s" direction="vertical" alignItems="center">
    <Button iconName="edit" variant="icon" ariaLabel="Edit" />
    <Button iconName="copy" variant="icon" ariaLabel="Duplicate" />
    <Button iconName="download" variant="icon" ariaLabel="Export" />
  </SpaceBetween>
);

// Legacy exports
export const primaryContent = primaryHorizontalContent;
export const secondaryContent = secondaryHorizontalContent;

// Shared filler content for scrollable areas
export const filler = Array.from({ length: 50 }, (_, i) => (
  <Box key={i} padding={{ vertical: 'xxs' }}>
    Scrollable content line {i + 1}
  </Box>
));

// Shared layout styles for full-screen demo pages
export const layoutStyles = {
  fullHeight: { display: 'flex', flexDirection: 'column', height: '100vh' } as React.CSSProperties,
  fullHeightRow: { display: 'flex', height: '100vh' } as React.CSSProperties,
  row: { display: 'flex', flex: 1, minHeight: 0 } as React.CSSProperties,
  column: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 } as React.CSSProperties,
  scrollable: { flex: 1, overflow: 'auto', padding: '16px' } as React.CSSProperties,
};
