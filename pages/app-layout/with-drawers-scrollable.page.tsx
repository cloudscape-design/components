// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';

import {
  AppLayout,
  Button,
  ContentLayout,
  Drawer,
  Header,
  HelpPanel,
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
import { drawerLabels } from './utils/drawers';
import appLayoutLabels from './utils/labels';
import { splitPaneli18nStrings } from './utils/strings';

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

awsuiPlugins.appLayout.registerDrawer({
  id: 'circle1-global',
  type: 'global',
  ariaLabels: getAriaLabels('global drawer 1'),
  defaultActive: true,
  resizable: true,
  defaultSize: 320,
  trigger: {
    iconSvg: `<svg viewBox="0 0 16 16" focusable="false">
      <circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="7" />
      <circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="3" />
    </svg>`,
  },
  mountContent: container => {
    ReactDOM.render(<CustomDrawerContent />, container);
  },
  unmountContent: container => unmountComponentAtNode(container),
});
awsuiPlugins.appLayout.registerDrawer({
  id: 'global-with-stored-state',
  type: 'global',
  defaultActive: false,
  resizable: true,
  defaultSize: 320,

  ariaLabels: getAriaLabels('global drawer 2'),

  mountContent: container => {
    ReactDOM.render(
      <Drawer header="Global drawer">
        <ScrollableDrawerContent contentType="text" />
      </Drawer>,
      container
    );
  },
  unmountContent: container => unmountComponentAtNode(container),
});

awsuiPlugins.appLayout.registerDrawer({
  id: 'security',
  ariaLabels: getAriaLabels('runtime drawer'),
  resizable: true,
  defaultSize: 320,
  trigger: {
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <rect x="2" y="7" width="12" height="7" fill="none" stroke="currentColor" stroke-width="2" />
      <path d="M4,7V5a4,4,0,0,1,8,0V7" fill="none" stroke="currentColor" stroke-width="2" />
    </svg>`,
  },
  mountContent: container => {
    ReactDOM.render(
      <Drawer>
        <>
          <p>This is a headerless drawer in a runtime local drawer.</p>
          <ScrollableDrawerContent />
        </>
      </Drawer>,
      container
    );
  },
  unmountContent: container => unmountComponentAtNode(container),
});

export default function WithDrawersScrollable() {
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
      {
        id: 'settings',
        ariaLabels: getAriaLabels('fill content'),
        content: <ContentFill />,
        trigger: {
          iconName: 'settings',
        },
      },
      {
        id: 'help',
        ariaLabels: getAriaLabels('headerless help'),
        content: (
          <HelpPanel>
            <>
              <p>This is a headerless help panel in a local drawer.</p>
              <ScrollableDrawerContent contentType="image" />
            </>
          </HelpPanel>
        ),
        trigger: {
          iconName: 'status-info',
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
        ariaLabels={{ ...appLayoutLabels, ...drawerLabels }}
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
          <SplitPanel header="Split panel header" i18nStrings={splitPaneli18nStrings}>
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
