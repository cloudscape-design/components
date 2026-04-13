// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, ButtonDropdownProps, Header, SpaceBetween } from '~components';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import ButtonGroup from '~components/button-group';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';

const profileItems: ButtonDropdownProps.Items = [
  { id: 'profile', text: 'Profile' },
  { id: 'preferences', text: 'Preferences' },
  { id: 'security', text: 'Security credentials' },
  { id: 'signout', text: 'Sign out' },
];

const serviceItems: ButtonDropdownProps.Items = [
  { id: 'ec2', text: 'EC2' },
  { id: 's3', text: 'S3' },
  { id: 'lambda', text: 'Lambda' },
  { id: 'rds', text: 'RDS' },
  { id: 'cloudfront', text: 'CloudFront' },
  { id: 'dynamodb', text: 'DynamoDB' },
];

const regionItems: ButtonDropdownProps.Items = [
  { id: 'us-east-1', text: 'US East (N. Virginia)' },
  { id: 'us-west-2', text: 'US West (Oregon)' },
  { id: 'eu-west-1', text: 'EU (Ireland)' },
  { id: 'ap-southeast-1', text: 'Asia Pacific (Singapore)' },
];

export default function NavigationBarButtonsDropdownsPage() {
  return (
    <article>
      <h1>Navigation Bar — Buttons &amp; Dropdowns</h1>

      <SpaceBetween size="l">
        <Box>
          <Header variant="h2">Icon buttons via ButtonGroup</Header>
          <NavigationBar
            ariaLabel="Icon buttons demo"
            startContent={
              <Link href="#" fontSize="heading-m" color="inverted">
                Service
              </Link>
            }
            endContent={
              <ButtonGroup
                variant="icon"
                ariaLabel="Actions"
                items={[
                  { type: 'icon-button', id: 'search', text: 'Search', iconName: 'search' },
                  { type: 'icon-button', id: 'notifications', text: 'Notifications', iconName: 'notification' },
                  { type: 'icon-button', id: 'settings', text: 'Settings', iconName: 'settings' },
                  { type: 'icon-button', id: 'help', text: 'Help', iconName: 'status-info' },
                ]}
                onItemClick={() => {}}
              />
            }
          />
        </Box>

        <Box>
          <Header variant="h2">Menu dropdowns via ButtonGroup</Header>
          <NavigationBar
            ariaLabel="Menu dropdowns demo"
            startContent={
              <Link href="#" fontSize="heading-m" color="inverted">
                Console
              </Link>
            }
            endContent={
              <ButtonGroup
                variant="icon"
                ariaLabel="Utilities"
                items={[
                  { type: 'menu-dropdown', id: 'services', text: 'Services', items: serviceItems },
                  { type: 'menu-dropdown', id: 'region', text: 'Region', items: regionItems },
                  { type: 'menu-dropdown', id: 'profile', text: 'user@example.com', items: profileItems },
                ]}
                onItemClick={() => {}}
              />
            }
          />
        </Box>

        <Box>
          <Header variant="h2">Standalone ButtonDropdown components</Header>
          <NavigationBar
            ariaLabel="Standalone dropdowns demo"
            startContent={
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Link href="#" fontSize="heading-m" color="inverted">
                  App
                </Link>
                <ButtonDropdown items={serviceItems} variant="primary">
                  Services
                </ButtonDropdown>
                <ButtonDropdown items={regionItems} variant="normal">
                  Region
                </ButtonDropdown>
              </SpaceBetween>
            }
            endContent={
              <ButtonDropdown items={profileItems} variant="icon" ariaLabel="User menu">
                Account
              </ButtonDropdown>
            }
          />
        </Box>

        <Box>
          <Header variant="h2">Mixed: buttons + dropdowns on secondary bar</Header>
          <NavigationBar
            variant="secondary"
            ariaLabel="Mixed toolbar"
            startContent={
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Button iconName="menu" variant="icon" ariaLabel="Toggle navigation" />
                <Button variant="link">Dashboard</Button>
                <Button variant="link">Reports</Button>
                <ButtonDropdown items={serviceItems}>More</ButtonDropdown>
              </SpaceBetween>
            }
            endContent={
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Button iconName="refresh" variant="icon" ariaLabel="Refresh" />
                <Button iconName="download" variant="icon" ariaLabel="Export" />
                <ButtonDropdown items={profileItems} variant="icon" ariaLabel="Settings">
                  Settings
                </ButtonDropdown>
              </SpaceBetween>
            }
          />
        </Box>

        <Box>
          <Header variant="h2">Dense icon bar (many utilities)</Header>
          <NavigationBar
            ariaLabel="Dense icon bar"
            startContent={
              <Link href="#" fontSize="heading-m" color="inverted">
                Editor
              </Link>
            }
            endContent={
              <ButtonGroup
                variant="icon"
                ariaLabel="Editor tools"
                items={[
                  { type: 'icon-button', id: 'undo', text: 'Undo', iconName: 'undo' },
                  { type: 'icon-button', id: 'redo', text: 'Redo', iconName: 'redo' },
                  { type: 'icon-button', id: 'copy', text: 'Copy', iconName: 'copy' },
                  { type: 'icon-button', id: 'remove', text: 'Delete', iconName: 'remove' },
                  { type: 'icon-button', id: 'download', text: 'Download', iconName: 'download' },
                  { type: 'icon-button', id: 'upload', text: 'Upload', iconName: 'upload' },
                  { type: 'icon-button', id: 'share', text: 'Share', iconName: 'share' },
                  { type: 'icon-button', id: 'expand', text: 'Fullscreen', iconName: 'expand' },
                ]}
                onItemClick={() => {}}
              />
            }
          />
        </Box>
      </SpaceBetween>
    </article>
  );
}
