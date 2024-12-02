// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';

import {
  AppLayout,
  Button,
  ContentLayout,
  Header,
  SideNavigation,
  SpaceBetween,
  SplitPanel,
  Toggle,
} from '~components';
import { AppLayoutProps } from '~components/app-layout';
import awsuiPlugins from '~components/internal/plugins';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import {
  Breadcrumbs,
  Containers,
  ContentFill,
  CustomDrawerContent,
  ScrollableDrawerContent,
} from './utils/content-blocks';
import appLayoutLabels from './utils/labels';

type DemoContext = React.Context<
  AppContextType<{
    sideNavFill: boolean | undefined;
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
  }>
>;

const getAriaLabels = (title: string) => {
  return {
    closeButton: `${title} close button`,
    drawerName: `${title}`,
    triggerButton: `${title} trigger button`,
    resizeHandle: `${title} resize handle`,
  };
};

export default function WithDrawersScrollable() {
  window.addEventListener('scroll', () => {
    console.log('Page scrolled!', {
      scrollY: window.scrollY,
      scrollX: window.scrollX,
    });
  });
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>('settings');
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const sideNavFill = urlParams.sideNavFill ?? false;
  const appLayoutRef = useRef<AppLayoutProps.Ref>(null);

  const sideNavContents: JSX.Element = sideNavFill ? (
    <ContentFill />
  ) : (
    <SideNavigation
      items={[
        {
          type: 'section',
          text: 'Section 1',
          items: [
            { type: 'link', text: 'Page 4', href: '#/page4' },
            { type: 'link', text: 'Page 5', href: '#/page5' },
            { type: 'link', text: 'Page 6', href: '#/page6' },
          ],
        },
        {
          type: 'section',
          text: 'Section 2',
          items: [
            { type: 'link', text: 'Page 7', href: '#/page7' },
            { type: 'link', text: 'Page 8', href: '#/page8' },
            { type: 'link', text: 'Page 9', href: '#/page9' },
          ],
        },
      ]}
    />
  );

  const drawersProps: Pick<AppLayoutProps, 'activeDrawerId' | 'onDrawerChange' | 'drawers'> | null = {
    activeDrawerId: activeDrawerId,
    drawers: [
      {
        id: 'chat',
        ariaLabels: getAriaLabels('chat'),
        content: <CustomDrawerContent />,
        trigger: {
          iconName: 'contact',
        },
      },
    ],
    onDrawerChange: event => {
      setActiveDrawerId(event.detail.activeDrawerId);
    },
  };

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={appLayoutLabels}
        breadcrumbs={<Breadcrumbs />}
        navigation={sideNavContents}
        ref={appLayoutRef}
        content={
          <ContentLayout
            disableOverlap={true}
            header={
              <SpaceBetween size="m">
                <Header variant="h1" description="Many drawers with scrollable content">
                  Testing Scrollable Drawers
                </Header>

                <SpaceBetween size="xs">
                  <Toggle
                    checked={sideNavFill}
                    onChange={({ detail }) => setUrlParams({ sideNavFill: detail.checked })}
                    data-testid="toggle-side-nav-content"
                  >
                    Fill side nav content area
                  </Toggle>

                  <Button
                    onClick={() => awsuiPlugins.appLayout.openDrawer('circle2-global')}
                    data-testid="open-global-drawer-button"
                  >
                    Open a drawer without a trigger
                  </Button>
                </SpaceBetween>
              </SpaceBetween>
            }
          >
            <Containers />
          </ContentLayout>
        }
        splitPanel={
          <SplitPanel
            header="Split panel header"
            i18nStrings={{
              preferencesTitle: 'Preferences',
              preferencesPositionLabel: 'Split panel position',
              preferencesPositionDescription: 'Choose the default split panel position for the service.',
              preferencesPositionSide: 'Side',
              preferencesPositionBottom: 'Bottom',
              preferencesConfirm: 'Confirm',
              preferencesCancel: 'Cancel',
              closeButtonAriaLabel: 'Close panel',
              openButtonAriaLabel: 'Open panel',
              resizeHandleAriaLabel: 'Slider',
            }}
          >
            <SpaceBetween size="l">
              <ScrollableDrawerContent />
              <ScrollableDrawerContent contentType="image" />
            </SpaceBetween>
          </SplitPanel>
        }
        splitPanelPreferences={{
          position: urlParams.splitPanelPosition,
        }}
        onSplitPanelPreferencesChange={event => {
          const { position } = event.detail;
          setUrlParams({ splitPanelPosition: position === 'side' ? position : undefined });
        }}
        {...drawersProps}
      />
    </ScreenshotArea>
  );
}
