// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import InternalButton from '~components/button/internal';
import ButtonDropdown from '~components/button-dropdown';
import Input from '~components/input';
import MenuDropdown from '~components/internal/components/menu-dropdown';
import Link from '~components/link';
import InternalLink from '~components/link/internal';
import NavigationBar from '~components/navigation-bar';
import SpaceBetween from '~components/space-between';
import TopNavigation from '~components/top-navigation';

import { SimplePage } from '../app/templates';

const utilities = (
  <div style={{ display: 'flex', alignItems: 'stretch', alignSelf: 'stretch' }}>
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', position: 'relative' }}>
      <Button variant="icon" iconName="notification" ariaLabel="Notifications" />
      <span
        style={{
          position: 'absolute',
          insetInlineEnd: 0,
          insetBlock: '8px',
          width: '1px',
          background: 'rgba(255,255,255,0.2)',
        }}
      />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', position: 'relative' }}>
      <Button variant="icon" iconName="settings" ariaLabel="Settings" />
      <span
        style={{
          position: 'absolute',
          insetInlineEnd: 0,
          insetBlock: '8px',
          width: '1px',
          background: 'rgba(255,255,255,0.2)',
        }}
      />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px' }}>
      <ButtonDropdown
        items={[
          { id: 'profile', text: 'Profile' },
          { id: 'preferences', text: 'Preferences' },
          { id: 'security', text: 'Security' },
          { id: 'signout', text: 'Sign out' },
        ]}
      >
        jane@example.com
      </ButtonDropdown>
    </div>
  </div>
);

const internalUtilities = (
  <div style={{ display: 'flex', alignItems: 'stretch', alignSelf: 'stretch' }}>
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', position: 'relative' }}>
      <InternalButton variant="icon" iconName="notification" ariaLabel="Notifications" badge={true} />
      <span
        style={{
          position: 'absolute',
          insetInlineEnd: 0,
          insetBlock: '8px',
          width: '1px',
          background: 'rgba(255,255,255,0.2)',
        }}
      />
    </div>
    <div style={{ display: 'flex', alignItems: 'stretch', padding: '0 12px', position: 'relative' }}>
      <MenuDropdown
        iconName="settings"
        ariaLabel="Settings"
        title="Settings"
        items={[
          { id: 'settings-org', text: 'Organizational settings' },
          { id: 'settings-project', text: 'Project settings' },
        ]}
      />
      <span
        style={{
          position: 'absolute',
          insetInlineEnd: 0,
          insetBlock: '8px',
          width: '1px',
          background: 'rgba(255,255,255,0.2)',
        }}
      />
    </div>
    <div style={{ display: 'flex', alignItems: 'stretch', padding: '0 8px' }}>
      <MenuDropdown
        iconName="user-profile"
        items={[
          { id: 'profile', text: 'Profile' },
          { id: 'preferences', text: 'Preferences' },
          { id: 'security', text: 'Security' },
          { id: 'signout', text: 'Sign out' },
        ]}
      >
        jane@example.com
      </MenuDropdown>
    </div>
  </div>
);

const search = (
  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
    <div style={{ width: '100%', maxWidth: '340px' }}>
      <Input type="search" placeholder="Search" ariaLabel="Search" value="" onChange={() => {}} />
    </div>
  </div>
);

export default function TopNavigationReplicaPage() {
  return (
    <SimplePage title="NavigationBar — TopNavigation replica">
      <SpaceBetween size="xl">
        {/* Reference */}
        <Box>
          <Box variant="h2">Reference: TopNavigation</Box>
          <TopNavigation
            identity={{ href: '#', title: 'Service Name' }}
            search={<Input type="search" placeholder="Search" ariaLabel="Search" value="" onChange={() => {}} />}
            utilities={[
              { type: 'button', iconName: 'notification', ariaLabel: 'Notifications', badge: true },
              { type: 'button', iconName: 'settings', ariaLabel: 'Settings' },
              {
                type: 'menu-dropdown',
                text: 'jane@example.com',
                description: 'jane@example.com',
                iconName: 'user-profile',
                items: [
                  { id: 'profile', text: 'Profile' },
                  { id: 'preferences', text: 'Preferences' },
                  { id: 'security', text: 'Security' },
                  { id: 'signout', text: 'Sign out' },
                ],
              },
            ]}
          />
        </Box>

        {/* Replica using internal components */}
        <Box>
          <Box variant="h2">Replica using internal components</Box>
          <Box variant="p" color="text-body-secondary">
            Uses InternalLink variant=&quot;top-navigation&quot;, InternalButton with badge, and MenuDropdown. Closest
            match to TopNavigation.
          </Box>
          <NavigationBar
            variant="primary-accent"
            ariaLabel="Main navigation (internal)"
            content={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  paddingInlineStart: '24px',
                  minHeight: '48px',
                }}
              >
                <Box fontWeight="bold">
                  <InternalLink href="#" fontSize="heading-m" variant="top-navigation">
                    Service Name
                  </InternalLink>
                </Box>
                {search}
                {internalUtilities}
              </div>
            }
          />
        </Box>

        {/* Replica using public components */}
        <Box>
          <Box variant="h2">Replica using public components</Box>
          <Box variant="p" color="text-body-secondary">
            Uses public Link and ButtonDropdown. Shows gaps: link underline on hover, no badge, no flat dropdown
            trigger.
          </Box>
          <NavigationBar
            variant="primary-accent"
            ariaLabel="Main navigation (public)"
            content={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  paddingInlineStart: '24px',
                  minHeight: '48px',
                }}
              >
                <Box fontWeight="bold">
                  <Link href="#" fontSize="heading-m">
                    Service Name
                  </Link>
                </Box>
                {search}
                {utilities}
              </div>
            }
          />
        </Box>

        {/* Gaps */}
        <Box>
          <Box variant="h2">Known gaps (public components only)</Box>
          <ul>
            <li>
              <strong>Link underline on hover</strong> — public Link shows underline. Internal uses
              variant=&quot;top-navigation&quot; which removes it.
            </li>
            <li>
              <strong>ButtonDropdown navigation styling</strong> — no flat trigger variant publicly available.
            </li>
            <li>
              <strong>Badge on icon buttons</strong> — not exposed on public Button.
            </li>
            <li>
              <strong>Responsive overflow</strong> — by design, builder handles responsive behavior.
            </li>
          </ul>
        </Box>
      </SpaceBetween>
    </SimplePage>
  );
}
