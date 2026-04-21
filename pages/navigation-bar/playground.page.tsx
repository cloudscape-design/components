// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { ButtonDropdownProps, Checkbox, FormField, SegmentedControl, SpaceBetween } from '~components';
import ButtonGroup from '~components/button-group';
import Input from '~components/input';
import Link from '~components/link';
import NavigationBar, { NavigationBarProps } from '~components/navigation-bar';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type PageContext = React.Context<
  AppContextType<{
    variant: NavigationBarProps.Variant;
    placement: NavigationBarProps.Placement;
    sticky: boolean;
    disablePadding: boolean;
    largeContent: boolean;
  }>
>;

const profileItems: ButtonDropdownProps.Items = [
  { id: 'profile', text: 'Profile' },
  { id: 'signout', text: 'Sign out' },
];

function Settings() {
  const {
    urlParams: {
      variant = 'primary',
      placement = 'block-start',
      sticky = false,
      disablePadding = false,
      largeContent = false,
    },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  return (
    <SpaceBetween size="m">
      <SpaceBetween size="s" direction="horizontal">
        <FormField label="Variant">
          <SegmentedControl
            options={[
              { id: 'primary', text: 'primary' },
              { id: 'secondary', text: 'secondary' },
            ]}
            selectedId={variant}
            onChange={({ detail }) => setUrlParams({ variant: detail.selectedId as NavigationBarProps.Variant })}
          />
        </FormField>
        <FormField label="Placement">
          <SegmentedControl
            options={[
              { id: 'block-start', text: 'block-start' },
              { id: 'block-end', text: 'block-end' },
              { id: 'inline-start', text: 'inline-start' },
              { id: 'inline-end', text: 'inline-end' },
            ]}
            selectedId={placement}
            onChange={({ detail }) => setUrlParams({ placement: detail.selectedId as NavigationBarProps.Placement })}
          />
        </FormField>
      </SpaceBetween>
      <SpaceBetween size="s" direction="horizontal">
        <Checkbox checked={sticky} onChange={({ detail }) => setUrlParams({ sticky: detail.checked })}>
          Sticky
        </Checkbox>
        <Checkbox checked={disablePadding} onChange={({ detail }) => setUrlParams({ disablePadding: detail.checked })}>
          disablePadding
        </Checkbox>
        <Checkbox checked={largeContent} onChange={({ detail }) => setUrlParams({ largeContent: detail.checked })}>
          Large content area
        </Checkbox>
      </SpaceBetween>
    </SpaceBetween>
  );
}

export default function NavigationBarPlaygroundPage() {
  const {
    urlParams: {
      variant = 'primary',
      placement = 'block-start',
      sticky = false,
      disablePadding = false,
      largeContent = false,
    },
  } = useContext(AppContext as PageContext);

  const [searchValue, setSearchValue] = useState('');
  const isVertical = placement === 'inline-start' || placement === 'inline-end';

  const navContent = isVertical ? (
    <ButtonGroup
      variant="icon"
      ariaLabel="Tools"
      items={[
        { type: 'icon-button', id: 'home', text: 'Home', iconName: 'view-full' },
        { type: 'icon-button', id: 'search', text: 'Search', iconName: 'search' },
        { type: 'icon-button', id: 'settings', text: 'Settings', iconName: 'settings' },
      ]}
      onItemClick={() => {}}
    />
  ) : (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
      <Link href="#" fontSize="heading-m" color={variant === 'primary' ? 'inverted' : undefined}>
        Application
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
          { type: 'icon-button', id: 'settings', text: 'Settings', iconName: 'settings' },
          { type: 'menu-dropdown', id: 'profile', text: 'User', items: profileItems },
        ]}
        onItemClick={() => {}}
      />
    </div>
  );

  return (
    <SimplePage title="Navigation Bar — Playground" settings={<Settings />}>
      <div
        style={{
          display: 'flex',
          flexDirection: isVertical ? 'row' : 'column',
          border: '1px solid #e9ebed',
        }}
      >
        {(placement === 'block-start' || placement === 'inline-start') && (
          <NavigationBar
            variant={variant}
            placement={placement}
            sticky={sticky}
            disablePadding={disablePadding}
            ariaLabel="Playground navigation"
            content={navContent}
          />
        )}
        <div
          style={{
            flex: 1,
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888',
            background: 'rgba(255, 0, 0, 0.05)',
            minHeight: largeContent ? 2000 : undefined,
          }}
        >
          Content area
        </div>
        {(placement === 'block-end' || placement === 'inline-end') && (
          <NavigationBar
            variant={variant}
            placement={placement}
            sticky={sticky}
            disablePadding={disablePadding}
            ariaLabel="Playground navigation"
            content={navContent}
          />
        )}
      </div>
    </SimplePage>
  );
}
