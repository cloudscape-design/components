// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';

import { Drawer, Header, Icon, Link, SideNavigation, SpaceBetween, Toggle } from '~components';
import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Box from '~components/box';
import SplitPanel from '~components/split-panel';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs } from './utils/content-blocks';
import * as content from './utils/contents';
import { drawerLabels } from './utils/drawers';
import labels from './utils/labels';
import { splitPaneli18nStrings } from './utils/strings';

type DrawerHeaderAndFooterDemoContext = React.Context<
  AppContextType<{
    drawerOpen: string | null;
    hasHeader: boolean;
    hasFooter: boolean;
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

export default function () {
  const {
    urlParams: {
      splitPanelPosition,
      longHeader = false,
      longFooter = false,
      longContent = false,
      hasHeader = true,
      hasFooter = true,
      splitPanelOpen = false,
    },
    setUrlParams,
  } = useContext(AppContext as DrawerHeaderAndFooterDemoContext);

  const [activeDrawerId, setActiveDrawerId] = useState<string | null>('sample-demo');

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
            ariaLabels: getAriaLabels('sample-demo'),
            id: 'sample-demo',
            resizable: true,
            defaultSize: 420,
            content: (
              <Drawer
                header={hasHeader && (longHeader ? content.longHeader : content.shortHeader)}
                footer={hasFooter && (longFooter ? content.longFooter : content.shortFooter)}
                headerActions={[<Icon key="icon" name="add-plus" />]}
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
        contentType="table"
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={event => setUrlParams({ splitPanelOpen: event.detail.open })}
        splitPanel={
          <SplitPanel header="Split panel header" i18nStrings={splitPaneli18nStrings}>
            <Box>Content</Box>
          </SplitPanel>
        }
        content={
          <SpaceBetween size="xs">
            <Header
              variant="h1"
              description="Sometimes all you need is a large cappuchino, and a million bucks."
              info={
                <Link data-testid="info-link-header" variant="info">
                  Info
                </Link>
              }
            >
              Drawers with Footer Demo, how it would look like in the app layout,
            </Header>
            {activeDrawerId === 'sample-demo' && (
              <Toggle checked={longContent} onChange={({ detail }) => setUrlParams({ longContent: detail.checked })}>
                Long content
              </Toggle>
            )}

            <Toggle
              checked={hasHeader}
              onChange={({ detail }) => setUrlParams({ hasHeader: detail.checked })}
              disabled={!activeDrawerId}
            >
              Has Header
            </Toggle>

            {hasHeader && activeDrawerId === 'sample-demo' && (
              <Box margin={{ left: 'l' }}>
                <Toggle
                  checked={longHeader}
                  onChange={({ detail }) => setUrlParams({ longHeader: detail.checked })}
                  disabled={!activeDrawerId}
                >
                  Long Header
                </Toggle>
              </Box>
            )}

            {activeDrawerId === 'sample-demo' && (
              <Toggle checked={hasFooter} onChange={({ detail }) => setUrlParams({ hasFooter: detail.checked })}>
                Has Footer
              </Toggle>
            )}

            {hasFooter && activeDrawerId === 'sample-demo' && (
              <Box margin={{ left: 'l' }}>
                <Toggle checked={longFooter} onChange={({ detail }) => setUrlParams({ longFooter: detail.checked })}>
                  Long Footer
                </Toggle>
              </Box>
            )}
          </SpaceBetween>
        }
      />
    </ScreenshotArea>
  );
}
