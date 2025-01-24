// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';

import { Button, ContentLayout, Header, HelpPanel, Link, PageLayout, SpaceBetween, SplitPanel } from '~components';
import { PageLayoutProps } from '~components/page-layout';

import AppContext, { AppContextType } from '../app/app-context';
import { Breadcrumbs, Containers, CustomDrawerContent, Navigation } from './utils/content-blocks';
import { drawerLabels } from './utils/drawers';
import appLayoutLabels from './utils/labels';

type DemoContext = React.Context<
  AppContextType<{
    hasTools: boolean | undefined;
    hasDrawers: boolean | undefined;
    splitPanelPosition: PageLayoutProps.SplitPanelPreferences['position'];
  }>
>;

export default function WithDrawers() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [helpPathSlug, setHelpPathSlug] = useState<string>('default');
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(true);
  const pageLayoutRef = useRef<PageLayoutProps.Ref>(null);

  const drawersProps: Pick<PageLayoutProps, 'activeDrawerId' | 'onDrawerChange' | 'drawers'> | null = {
    activeDrawerId: activeDrawerId,
    drawers: [
      {
        ariaLabels: {
          closeButton: 'ProHelp close button',
          drawerName: 'ProHelp drawer content',
          triggerButton: 'ProHelp trigger button',
          resizeHandle: 'ProHelp resize handle',
        },
        content: <CustomDrawerContent />,
        id: 'pro-help',
      },
    ],
    onDrawerChange: event => {
      setActiveDrawerId(event.detail.activeDrawerId);
    },
  };

  return (
    <PageLayout
      ariaLabels={{ ...appLayoutLabels, ...drawerLabels }}
      breadcrumbs={<Breadcrumbs />}
      ref={pageLayoutRef}
      content={
        <ContentLayout
          disableOverlap={true}
          header={
            <SpaceBetween size="m">
              <Header
                variant="h1"
                description="Sometimes you need custom triggers for drawers and navigation to get the job done."
                info={
                  <Link
                    data-testid="info-link-header"
                    variant="info"
                    onFollow={() => {
                      setHelpPathSlug('header');
                      setIsToolsOpen(true);
                      pageLayoutRef.current?.focusToolsClose();
                    }}
                  >
                    Info
                  </Link>
                }
              >
                Page layout
              </Header>

              <SpaceBetween size="xs">
                <Button
                  onClick={() => {
                    setIsNavigationOpen(current => !current);
                    pageLayoutRef.current?.focusNavigation();
                  }}
                >
                  Toggle navigation
                </Button>

                <Button
                  onClick={() => {
                    setActiveDrawerId('pro-help');
                    pageLayoutRef.current?.focusActiveDrawer();
                  }}
                >
                  Open a drawer without trigger
                </Button>
                <Button onClick={() => setActiveDrawerId(null)}>Close a drawer without trigger</Button>
              </SpaceBetween>
            </SpaceBetween>
          }
        >
          <Header
            info={
              <Link
                data-testid="info-link-content"
                variant="info"
                onFollow={() => {
                  setHelpPathSlug('content');
                  setIsToolsOpen(true);
                }}
              >
                Info
              </Link>
            }
          >
            Content
          </Header>
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
          This is the Split Panel!
        </SplitPanel>
      }
      splitPanelPreferences={{
        position: urlParams.splitPanelPosition,
      }}
      onSplitPanelPreferencesChange={event => {
        const { position } = event.detail;
        setUrlParams({ splitPanelPosition: position === 'side' ? position : undefined });
      }}
      onToolsChange={event => {
        setIsToolsOpen(event.detail.open);
      }}
      tools={<Info helpPathSlug={helpPathSlug} />}
      toolsOpen={isToolsOpen}
      navigationTriggerHide={true}
      navigationOpen={isNavigationOpen}
      navigation={<Navigation />}
      onNavigationChange={event => setIsNavigationOpen(event.detail.open)}
      {...drawersProps}
    />
  );
}

function Info({ helpPathSlug }: { helpPathSlug: string }) {
  return <HelpPanel header={<h2>Info</h2>}>Here is some info for you: {helpPathSlug}</HelpPanel>;
}
