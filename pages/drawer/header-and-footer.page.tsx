// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';

import { Button, ContentLayout, Drawer, Header, Link, SideNavigation, SpaceBetween, Toggle } from '~components';
import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Box from '~components/box';
import awsuiPlugins from '~components/internal/plugins';
import SplitPanel from '~components/split-panel';
import { mount, unmount } from '~mount';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs } from './utils/content-blocks';
import * as content from './utils/contents';
import labels, { drawerLabels } from './utils/labels';
import { splitPaneli18nStrings } from './utils/strings';

type DrawerHeaderAndFooterDemoContext = React.Context<
  AppContextType<{
    drawerOpen: string | null;
    hasHeader: boolean;
    hasFooter: boolean;
    stickyHeader: boolean;
    stickyFooter: boolean;
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
    longHeader: boolean;
    longFooter: boolean;
    longContent: boolean;
    splitPanelOpen: boolean;
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
  id: 'chat',
  type: 'global',
  ariaLabels: getAriaLabels('chat drawer'),
  defaultActive: true,
  resizable: true,
  defaultSize: 320,
  mountContent: container => {
    mount(<MyDrawer />, container);
  },
  unmountContent: container => unmount(container),
});

export default function () {
  const {
    urlParams: {
      splitPanelPosition,
      longHeader = false,
      longFooter = false,
      longContent = false,
      stickyFooter = true,
      stickyHeader = true,
      hasHeader = true,
      hasFooter = true,
      splitPanelOpen = false,
    },
    setUrlParams,
  } = useContext(AppContext as DrawerHeaderAndFooterDemoContext);

  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const drawerOpen = activeDrawerId !== null;

  const setDrawerOpenStatus = ({ drawerId }: { drawerId: string | null }) => {
    if (drawerId) {
      setUrlParams({ drawerOpen: drawerId });
    } else {
      setUrlParams({ drawerOpen: null });
    }

    if (drawerId) {
      awsuiPlugins.appLayout.openDrawer(drawerId);
    } else {
      awsuiPlugins.appLayout.closeDrawer('chat');
    }
  };

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={{ ...labels, ...drawerLabels }}
        breadcrumbs={<Breadcrumbs />}
        navigation={
          <SideNavigation
            header={{
              href: '#',
              text: 'On the other side',
            }}
            items={[]}
          />
        }
        splitPanelPreferences={{ position: splitPanelPosition }}
        onSplitPanelPreferencesChange={event => {
          const { position } = event.detail;
          setUrlParams({ splitPanelPosition: position === 'side' ? position : undefined });
        }}
        activeDrawerId={activeDrawerId}
        drawers={[
          {
            ariaLabels: getAriaLabels('chat'),
            id: 'chat',
            content: (
              <Drawer
                header={hasHeader && (longHeader ? content.longHeader : content.shortHeader)}
                footer={hasFooter && (longFooter ? content.longFooter : content.shortFooter)}
                stickyFooter={stickyFooter}
                stickyHeader={stickyHeader}
              >
                {longContent ? content.longContent : content.shortContent}
              </Drawer>
            ),
            trigger: {
              iconName: 'contact',
            },
          },
        ]}
        onDrawerChange={event => {
          setActiveDrawerId(event.detail.activeDrawerId);
        }}
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={event => setUrlParams({ splitPanelOpen: event.detail.open })}
        splitPanel={
          <SplitPanel header="Split panel header" i18nStrings={splitPaneli18nStrings}>
            <Box>Content</Box>
          </SplitPanel>
        }
        content={
          <ContentLayout
            header={
              <SpaceBetween size="m">
                <Header
                  variant="h1"
                  description="Sometimes all you need is a large cappuchino, and a million bucks."
                  info={
                    <Link data-testid="info-link-header" variant="info">
                      Info
                    </Link>
                  }
                >
                  Drawers with Advanced Headers and Footer
                </Header>
              </SpaceBetween>
            }
          >
            <SpaceBetween size="xs">
              <Toggle checked={longContent} onChange={({ detail }) => setUrlParams({ longContent: detail.checked })}>
                Long content
              </Toggle>

              <Toggle checked={hasHeader} onChange={({ detail }) => setUrlParams({ hasHeader: detail.checked })}>
                Has Header
              </Toggle>

              {hasHeader && (
                <Box margin={{ left: 'l' }}>
                  <Toggle
                    checked={stickyHeader}
                    onChange={({ detail }) => setUrlParams({ stickyHeader: detail.checked })}
                  >
                    Sticky Header
                  </Toggle>
                </Box>
              )}

              {hasHeader && (
                <Box margin={{ left: 'l' }}>
                  <Toggle checked={longHeader} onChange={({ detail }) => setUrlParams({ longHeader: detail.checked })}>
                    Long Header
                  </Toggle>
                </Box>
              )}

              <Toggle checked={hasFooter} onChange={({ detail }) => setUrlParams({ hasFooter: detail.checked })}>
                Has Footer
              </Toggle>

              {hasFooter && (
                <Box margin={{ left: 'l' }}>
                  <Toggle
                    checked={stickyFooter}
                    onChange={({ detail }) => setUrlParams({ stickyFooter: detail.checked })}
                  >
                    Sticky Footer
                  </Toggle>
                </Box>
              )}

              {hasFooter && (
                <Box margin={{ left: 'l' }}>
                  <Toggle checked={longFooter} onChange={({ detail }) => setUrlParams({ longFooter: detail.checked })}>
                    Long Footer
                  </Toggle>
                </Box>
              )}

              <Box margin={{ top: 'l' }}>
                <Button
                  variant="primary"
                  iconName="contact"
                  onClick={() => setDrawerOpenStatus({ drawerId: activeDrawerId ? null : 'chat' })}
                  data-testid="open-drawer-button"
                >
                  {drawerOpen ? 'Close Drawer' : 'Open Drawer'}
                </Button>
              </Box>
            </SpaceBetween>
          </ContentLayout>
        }
      />
    </ScreenshotArea>
  );
}

function MyDrawer() {
  return <></>;
}
