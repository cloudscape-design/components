// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import { Container, FormField, Header, SegmentedControl, SpaceBetween } from '~components';
import ButtonGroup from '~components/button-group';
import Link from '~components/link';
import NavigationBar, { NavigationBarProps } from '~components/navigation-bar';

import AppContext, { AppContextType } from '../app/app-context';

type PageContext = React.Context<
  AppContextType<{
    variant: NavigationBarProps.Variant;
    placement: NavigationBarProps.Placement;
  }>
>;

const toolItems = [
  { type: 'icon-button' as const, id: 'home', text: 'Home', iconName: 'view-full' as const },
  { type: 'icon-button' as const, id: 'search', text: 'Search', iconName: 'search' as const },
  { type: 'icon-button' as const, id: 'settings', text: 'Settings', iconName: 'settings' as const },
];

const accountItems = [
  { type: 'icon-button' as const, id: 'profile', text: 'Profile', iconName: 'user-profile' as const },
];

export default function NavigationBarVariantsPage() {
  const {
    urlParams: { variant = 'primary', placement = 'block-start' },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  const isVertical = placement === 'inline-start' || placement === 'inline-end';

  return (
    <article>
      <h1>Navigation Bar — Variants &amp; Placements</h1>

      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Configuration</Header>}>
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
                onChange={({ detail }) =>
                  setUrlParams({ placement: detail.selectedId as NavigationBarProps.Placement })
                }
              />
            </FormField>
          </SpaceBetween>
        </Container>

        <div
          style={{
            display: 'flex',
            flexDirection: isVertical ? 'row' : 'column',
            height: isVertical ? '500px' : 'auto',
            border: '1px solid #e9ebed',
          }}
        >
          {(placement === 'block-start' || placement === 'inline-start') && (
            <NavigationBar
              variant={variant}
              placement={placement}
              ariaLabel="Demo navigation"
              startContent={
                isVertical ? (
                  <ButtonGroup variant="icon" ariaLabel="Tools" items={toolItems} onItemClick={() => {}} />
                ) : (
                  <Link href="#" fontSize="heading-m" color={variant === 'primary' ? 'inverted' : undefined}>
                    Application
                  </Link>
                )
              }
              endContent={
                <ButtonGroup variant="icon" ariaLabel="Account" items={accountItems} onItemClick={() => {}} />
              }
            />
          )}

          <div style={{ flex: 1, padding: '20px' }}>
            <Header variant="h2">Main content area</Header>
            <p>
              Showing <code>variant=&quot;{variant}&quot;</code> with <code>placement=&quot;{placement}&quot;</code>
            </p>
          </div>

          {(placement === 'block-end' || placement === 'inline-end') && (
            <NavigationBar
              variant={variant}
              placement={placement}
              ariaLabel="Demo navigation"
              startContent={
                isVertical ? (
                  <ButtonGroup variant="icon" ariaLabel="Tools" items={toolItems} onItemClick={() => {}} />
                ) : (
                  <Link href="#" fontSize="heading-m" color={variant === 'primary' ? 'inverted' : undefined}>
                    Application
                  </Link>
                )
              }
              endContent={
                <ButtonGroup variant="icon" ariaLabel="Account" items={accountItems} onItemClick={() => {}} />
              }
            />
          )}
        </div>
      </SpaceBetween>
    </article>
  );
}
