// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Horizontal + Vertical composition demo
 *
 * The consumer owns the viewport layout, not the NavigationBar.
 * Uses a flex column (100vh) with the horizontal bar on top and a flex row
 * below it. The vertical bar fills the row height via block-size:100%.
 * min-height:0 on the row prevents tall content from pushing it beyond the viewport.
 */
import React, { useContext } from 'react';

import {
  // Checkbox,
  Container,
  // FormField,
  Header,
  // SegmentedControl,
  SpaceBetween,
} from '~components';
import ButtonGroup from '~components/button-group';
import Link from '~components/link';
import NavigationBar, { NavigationBarProps } from '~components/navigation-bar';
import SideNavigation from '~components/side-navigation';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type PageContext = React.Context<
  AppContextType<{
    horizontalVariant: NavigationBarProps.Variant;
    verticalVariant: NavigationBarProps.Variant;
    showSideNav: boolean;
  }>
>;

const filler = Array.from({ length: 8 }, (_, i) => (
  <Container key={i} header={<Header variant="h2">Resource {i + 1}</Header>}>
    <p>Resource details for item {i + 1}.</p>
  </Container>
));

// function Settings() {
//   const {
//     urlParams: { horizontalVariant = 'primary', verticalVariant = 'secondary', showSideNav = true },
//     setUrlParams,
//   } = useContext(AppContext as PageContext);

//   return (
//     <SpaceBetween size="s" direction="horizontal">
//       <FormField label="Horizontal variant">
//         <SegmentedControl
//           options={[
//             { id: 'primary', text: 'primary' },
//             { id: 'secondary', text: 'secondary' },
//           ]}
//           selectedId={horizontalVariant}
//           onChange={({ detail }) =>
//             setUrlParams({ horizontalVariant: detail.selectedId as NavigationBarProps.Variant })
//           }
//         />
//       </FormField>
//       <FormField label="Vertical variant">
//         <SegmentedControl
//           options={[
//             { id: 'primary', text: 'primary' },
//             { id: 'secondary', text: 'secondary' },
//           ]}
//           selectedId={verticalVariant}
//           onChange={({ detail }) => setUrlParams({ verticalVariant: detail.selectedId as NavigationBarProps.Variant })}
//         />
//       </FormField>
//       <Checkbox checked={showSideNav} onChange={({ detail }) => setUrlParams({ showSideNav: detail.checked })}>
//         Side navigation
//       </Checkbox>
//     </SpaceBetween>
//   );
// }

export default function NavigationBarHorizontalVerticalPage() {
  const {
    urlParams: { horizontalVariant = 'primary', verticalVariant = 'secondary', showSideNav = true },
  } = useContext(AppContext as PageContext);

  return (
    <SimplePage
      title="Navigation Bar — Horizontal + Vertical Composition"
      // settings={<Settings />}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', border: '1px solid #e9ebed' }}>
        <NavigationBar
          variant={horizontalVariant}
          ariaLabel="Global navigation"
          content={
            <Link href="#" fontSize="heading-m" color={horizontalVariant === 'primary' ? 'inverted' : undefined}>
              My Application
            </Link>
          }
        />

        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <NavigationBar
            variant={verticalVariant}
            placement="inline-start"
            ariaLabel="Tool rail"
            content={
              <ButtonGroup
                variant="icon"
                ariaLabel="Tools"
                items={[
                  { type: 'icon-button', id: 'home', text: 'Home', iconName: 'view-full' },
                  { type: 'icon-button', id: 'search', text: 'Search', iconName: 'search' },
                  { type: 'icon-button', id: 'folder', text: 'Files', iconName: 'folder' },
                  { type: 'icon-button', id: 'edit', text: 'Editor', iconName: 'edit' },
                ]}
                onItemClick={() => {}}
              />
            }
          />

          {showSideNav && (
            <div style={{ inlineSize: 240, borderInlineEnd: '1px solid #e9ebed', overflow: 'auto' }}>
              <SideNavigation
                header={{ text: 'Navigation', href: '#' }}
                activeHref="#"
                items={[
                  { type: 'link', text: 'Overview', href: '#' },
                  { type: 'link', text: 'Analytics', href: '#' },
                  { type: 'link', text: 'Deployments', href: '#' },
                  {
                    type: 'section',
                    text: 'Settings',
                    items: [
                      { type: 'link', text: 'General', href: '#' },
                      { type: 'link', text: 'Permissions', href: '#' },
                    ],
                  },
                ]}
              />
            </div>
          )}

          <div style={{ flex: 1, padding: 20, overflow: 'auto' }}>
            <SpaceBetween size="l">
              <Header variant="h1">Overview</Header>
              {filler}
            </SpaceBetween>
          </div>
        </div>
      </div>
    </SimplePage>
  );
}
