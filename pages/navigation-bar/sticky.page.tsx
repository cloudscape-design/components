// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { ButtonDropdownProps, Checkbox, FormField, Header, SpaceBetween, Table } from '~components';
import ButtonGroup from '~components/button-group';
import Container from '~components/container';
import Input from '~components/input';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';

import AppContext, { AppContextType } from '../app/app-context';

type PageContext = React.Context<
  AppContextType<{ primarySticky: boolean; secondarySticky: boolean; tableSticky: boolean }>
>;

const profileItems: ButtonDropdownProps.Items = [
  { id: 'profile', text: 'Profile' },
  { id: 'signout', text: 'Sign out' },
];

const tableItems = Array.from({ length: 30 }, (_, i) => ({
  id: `item-${i + 1}`,
  name: `Resource ${i + 1}`,
  type: i % 3 === 0 ? 'EC2' : i % 3 === 1 ? 'S3' : 'RDS',
  status: i % 2 === 0 ? 'Running' : 'Stopped',
  region: i % 2 === 0 ? 'us-east-1' : 'eu-west-1',
}));

const filler = Array.from({ length: 3 }, (_, i) => (
  <Container key={i} header={<Header variant="h2">Section {i + 1}</Header>}>
    <p>
      Scroll down to see sticky behavior. The table below has a sticky header that offsets below both navigation bars.
    </p>
  </Container>
));

export default function NavigationBarStickyPage() {
  const {
    urlParams: { primarySticky = true, secondarySticky = true, tableSticky = true },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  const [searchValue, setSearchValue] = useState('');

  return (
    <div>
      <div
        style={{
          padding: '12px 20px',
          background: '#f2f3f3',
          borderBottom: '1px solid #e9ebed',
          display: 'flex',
          gap: 24,
        }}
      >
        <FormField label="Primary bar">
          <Checkbox checked={primarySticky} onChange={({ detail }) => setUrlParams({ primarySticky: detail.checked })}>
            Sticky
          </Checkbox>
        </FormField>
        <FormField label="Secondary bar">
          <Checkbox
            checked={secondarySticky}
            onChange={({ detail }) => setUrlParams({ secondarySticky: detail.checked })}
          >
            Sticky
          </Checkbox>
        </FormField>
        <FormField label="Table header">
          <Checkbox checked={tableSticky} onChange={({ detail }) => setUrlParams({ tableSticky: detail.checked })}>
            Sticky
          </Checkbox>
        </FormField>
      </div>

      <NavigationBar
        variant="primary"
        sticky={primarySticky}
        ariaLabel="Primary navigation"
        content={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
            <Link href="#" fontSize="heading-m" color="inverted">
              My Application
            </Link>
            <div style={{ flex: 1 }}>
              <Input
                type="search"
                ariaLabel="Search"
                placeholder="Search..."
                value={searchValue}
                onChange={({ detail }) => setSearchValue(detail.value)}
              />
            </div>
            <ButtonGroup
              variant="icon"
              ariaLabel="Utilities"
              items={[
                { type: 'icon-button', id: 'notifications', text: 'Notifications', iconName: 'notification' },
                { type: 'menu-dropdown', id: 'profile', text: 'User', items: profileItems },
              ]}
              onItemClick={() => {}}
            />
          </div>
        }
      />

      <NavigationBar
        variant="secondary"
        sticky={secondarySticky}
        ariaLabel="Toolbar"
        content={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
            <ButtonGroup
              variant="icon"
              ariaLabel="Actions"
              items={[
                { type: 'icon-button', id: 'back', text: 'Back', iconName: 'angle-left' },
                { type: 'icon-button', id: 'forward', text: 'Forward', iconName: 'angle-right' },
                { type: 'icon-button', id: 'refresh', text: 'Refresh', iconName: 'refresh' },
              ]}
              onItemClick={() => {}}
            />
            <span style={{ flex: 1, fontSize: 14, color: '#5f6b7a' }}>Dashboard / Overview</span>
            <ButtonGroup
              variant="icon"
              ariaLabel="View options"
              items={[
                { type: 'icon-button', id: 'settings', text: 'Settings', iconName: 'settings' },
                { type: 'icon-button', id: 'help', text: 'Help', iconName: 'status-info' },
              ]}
              onItemClick={() => {}}
            />
          </div>
        }
      />

      <div style={{ padding: 20 }}>
        <SpaceBetween size="m">
          {...filler}

          <Table
            header={<Header variant="h2">Resources (sticky header)</Header>}
            stickyHeader={tableSticky}
            columnDefinitions={[
              { id: 'name', header: 'Name', cell: item => item.name },
              { id: 'type', header: 'Type', cell: item => item.type },
              { id: 'status', header: 'Status', cell: item => item.status },
              { id: 'region', header: 'Region', cell: item => item.region },
            ]}
            items={tableItems}
            ariaLabels={{ tableLabel: 'Resources table' }}
          />
        </SpaceBetween>
      </div>
    </div>
  );
}
