// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { ButtonDropdownProps, Checkbox, FormField, Header, Input, SpaceBetween, Table } from '~components';
import ButtonGroup from '~components/button-group';
import Container from '~components/container';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';

import AppContext, { AppContextType } from '../app/app-context';

type PageContext = React.Context<
  AppContextType<{
    maxWidth: string;
    stickyOffset: string;
    sticky: boolean;
  }>
>;

const profileItems: ButtonDropdownProps.Items = [
  { id: 'profile', text: 'Profile' },
  { id: 'signout', text: 'Sign out' },
];

const tableItems = Array.from({ length: 20 }, (_, i) => ({
  id: `${i}`,
  name: `Resource ${i + 1}`,
  type: i % 2 === 0 ? 'EC2' : 'S3',
  status: i % 2 === 0 ? 'Running' : 'Stopped',
}));

export default function NavigationBarMaxWidthOffsetPage() {
  const {
    urlParams: { maxWidth = '1200', stickyOffset = '0', sticky = false },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  const [search, setSearch] = useState('');

  const maxWidthNum = parseInt(maxWidth) || undefined;
  const stickyOffsetNum = parseInt(stickyOffset) || 0;

  return (
    <div>
      {/* Controls */}
      <div
        style={{
          padding: '12px 20px',
          background: '#f2f3f3',
          borderBottom: '1px solid #e9ebed',
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <FormField label="maxWidth (px)">
          <Input value={maxWidth} onChange={({ detail }) => setUrlParams({ maxWidth: detail.value })} type="number" />
        </FormField>
        <FormField label="stickyOffset (px)">
          <Input
            value={stickyOffset}
            onChange={({ detail }) => setUrlParams({ stickyOffset: detail.value })}
            type="number"
          />
        </FormField>
        <FormField label="Sticky">
          <Checkbox checked={sticky} onChange={({ detail }) => setUrlParams({ sticky: detail.checked })}>
            Enabled
          </Checkbox>
        </FormField>
      </div>

      {/* Page content — body scrolls */}
      <NavigationBar
        variant="primary"
        sticky={sticky}
        stickyOffset={stickyOffsetNum}
        maxWidth={maxWidthNum}
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
                value={search}
                onChange={({ detail }) => setSearch(detail.value)}
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
        sticky={sticky}
        maxWidth={maxWidthNum}
        ariaLabel="Toolbar"
        content={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
            <span style={{ flex: 1, fontSize: 14 }}>Dashboard / Overview</span>
            <ButtonGroup
              variant="icon"
              ariaLabel="Actions"
              items={[
                { type: 'icon-button', id: 'refresh', text: 'Refresh', iconName: 'refresh' },
                { type: 'icon-button', id: 'settings', text: 'Settings', iconName: 'settings' },
              ]}
              onItemClick={() => {}}
            />
          </div>
        }
      />

      <div style={{ maxWidth: maxWidthNum, marginInline: 'auto', padding: 20 }}>
        <SpaceBetween size="m">
          <Container header={<Header variant="h2">Content area</Header>}>
            <p>
              The navigation bar content is constrained to <strong>{maxWidthNum ?? 'full'}px</strong> max width.
            </p>
            <p>The background still spans the full viewport width.</p>
            {stickyOffsetNum > 0 && (
              <p>
                There is a <strong>{stickyOffsetNum}px</strong> gap above the primary bar.
              </p>
            )}
          </Container>

          <Table
            header={<Header variant="h2">Resources (sticky header)</Header>}
            stickyHeader={sticky}
            columnDefinitions={[
              { id: 'name', header: 'Name', cell: item => item.name },
              { id: 'type', header: 'Type', cell: item => item.type },
              { id: 'status', header: 'Status', cell: item => item.status },
            ]}
            items={tableItems}
            ariaLabels={{ tableLabel: 'Resources' }}
          />
        </SpaceBetween>
      </div>
    </div>
  );
}
