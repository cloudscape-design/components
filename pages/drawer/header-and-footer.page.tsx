// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';

import { ContentLayout, Drawer, Header, Link, SideNavigation, SpaceBetween, Toggle } from '~components';
import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Box from '~components/box';
import SplitPanel from '~components/split-panel';

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
      stickyHeader = true,
      hasHeader = true,
      hasFooter = true,
      splitPanelOpen = false,
    },
    setUrlParams,
  } = useContext(AppContext as DrawerHeaderAndFooterDemoContext);

  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);

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
                stickyHeader={stickyHeader}
              >
                {longContent ? content.longContent : content.shortContent}
              </Drawer>
            ),
            trigger: {
              iconName: 'contact',
            },
          },
          {
            ariaLabels: getAriaLabels('chat'),
            id: 'chat',
            resizable: true,
            defaultSize: 420,
            content: (
              <Drawer
                header={hasHeader && content.amazonQHeader}
                footer={hasFooter && content.amazonQFooter}
                stickyHeader={stickyHeader}
              >
                {content.amazonQContent}
              </Drawer>
            ),
            trigger: {
              iconSvg: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="100%"
                  width="100%"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id="linear-gradient"
                      x1="43.37"
                      y1="-3.59"
                      x2="7.13"
                      y2="48.17"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#a7f8ff"></stop>
                      <stop offset=".03" stopColor="#9df1ff"></stop>
                      <stop offset=".08" stopColor="#84e1ff"></stop>
                      <stop offset=".15" stopColor="#5ac7ff"></stop>
                      <stop offset=".22" stopColor="#21a2ff"></stop>
                      <stop offset=".26" stopColor="#008dff"></stop>
                      <stop offset=".66" stopColor="#7f33ff"></stop>
                      <stop offset=".99" stopColor="#39127d"></stop>
                    </linearGradient>
                  </defs>
                  <path
                    d="m20.37.99L5.97,9.3c-2.28,1.32-3.69,3.75-3.69,6.39v16.63c0,2.63,1.41,5.07,3.69,6.39l14.4,8.31c2.28,1.32,5.09,1.32,7.37,0l14.4-8.31c2.28-1.32,3.69-3.75,3.69-6.39V15.69c0-2.63-1.41-5.07-3.69-6.39L27.74.99c-2.28-1.32-5.09-1.32-7.37,0Z"
                    fill="url(#linear-gradient)"
                    strokeWidth="0"
                    color="transparent"
                  ></path>
                  <path
                    d="m36.64,14.66l-10.79-6.23c-.49-.29-1.15-.43-1.8-.43s-1.3.14-1.8.43l-10.79,6.23c-.99.57-1.8,1.97-1.8,3.11v12.46c0,1.14.81,2.54,1.8,3.11l10.79,6.23c.49.29,1.15.43,1.8.43s1.3-.14,1.8-.43l10.79-6.23c.99-.57,1.8-1.97,1.8-3.11v-12.46c0-1.14-.81-2.54-1.8-3.11Zm-12.3,22.33s-.14.03-.28.03-.24-.02-.28-.03l-10.82-6.25c-.11-.1-.25-.35-.28-.49v-12.5c.03-.14.18-.39.28-.49l10.82-6.25s.14-.03.28-.03.24.02.28.03l10.82,6.25c.11.1.25.35.28.49v11.09l-8.38-4.84v-1.32c0-.26-.14-.49-.36-.62l-2.28-1.32c-.11-.06-.24-.1-.36-.1s-.25.03-.36.1l-2.28,1.32c-.22.13-.36.37-.36.62v2.63c0,.26.14.49.36.62l2.28,1.32c.11.06.24.1.36.1s.25-.03.36-.1l1.14-.66,8.38,4.84-9.6,5.54Z"
                    fill="#fff"
                    color="transparent"
                  ></path>
                </svg>
              ),
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
          <ContentLayout
            header={
              <Header
                variant="h1"
                description="Sometimes all you need is a large cappuchino, and a million bucks."
                info={
                  <Link data-testid="info-link-header" variant="info">
                    Info
                  </Link>
                }
              >
                Drawers with Sticky Headers and Footer Demo
              </Header>
            }
          >
            <SpaceBetween size="xs">
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

              {hasHeader && (
                <Box margin={{ left: 'l' }}>
                  <Toggle
                    checked={stickyHeader}
                    onChange={({ detail }) => setUrlParams({ stickyHeader: detail.checked })}
                    disabled={!activeDrawerId}
                  >
                    Sticky Header
                  </Toggle>
                </Box>
              )}

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
          </ContentLayout>
        }
      />
    </ScreenshotArea>
  );
}
