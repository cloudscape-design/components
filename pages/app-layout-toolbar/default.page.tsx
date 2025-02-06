// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';

import {
  AppLayoutToolbar,
  Button,
  ContentLayout,
  Header,
  HelpPanel,
  Link,
  SpaceBetween,
  SplitPanel,
  Toggle,
} from '~components';
import { AppLayoutToolbarProps } from '~components/app-layout-toolbar';

import AppContext, { AppContextType } from '../app/app-context';
import { Breadcrumbs, Containers, CustomDrawerContent, Navigation } from './utils/content-blocks';
import { drawerLabels } from './utils/drawers';
import appLayoutLabels from './utils/labels';

type DemoContext = React.Context<
  AppContextType<{
    navigationTriggerHide: boolean | undefined;
    drawerTriggerHide: boolean | undefined;
    splitPanelTriggerHide: boolean | undefined;
    breadcrumbsHide: boolean | undefined;
    splitPanelPosition: AppLayoutToolbarProps.SplitPanelPreferences['position'];
  }>
>;

export default function WithDrawers() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [helpPathSlug, setHelpPathSlug] = useState<string>('default');
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const navigationTriggerHide = urlParams.navigationTriggerHide ?? false;
  const drawerTriggerHide = urlParams.drawerTriggerHide ?? false;
  const splitPanelTriggerHide = urlParams.splitPanelTriggerHide ?? false;
  const breadcrumbsHide = urlParams.breadcrumbsHide ?? false;
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(true);
  const [splitPanelOpen, setSplitPanelOpen] = useState(false);
  const pageLayoutRef = useRef<AppLayoutToolbarProps.Ref>(null);

  const drawersProps: Pick<AppLayoutToolbarProps, 'activeDrawerId' | 'onDrawerChange' | 'drawers'> | null = {
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
        trigger: drawerTriggerHide
          ? undefined
          : {
              iconName: 'contact',
            },
      },
    ],
    onDrawerChange: event => {
      setActiveDrawerId(event.detail.activeDrawerId);
    },
  };

  return (
    <AppLayoutToolbar
      ariaLabels={{ ...appLayoutLabels, ...drawerLabels }}
      breadcrumbs={breadcrumbsHide ? undefined : <Breadcrumbs />}
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
                <Toggle
                  checked={navigationTriggerHide}
                  onChange={({ detail }) => setUrlParams({ navigationTriggerHide: detail.checked })}
                >
                  Hide navigation trigger
                </Toggle>
                <Toggle
                  checked={drawerTriggerHide}
                  onChange={({ detail }) => setUrlParams({ drawerTriggerHide: detail.checked })}
                >
                  Hide drawer trigger
                </Toggle>
                <Toggle
                  checked={splitPanelTriggerHide}
                  onChange={({ detail }) => setUrlParams({ splitPanelTriggerHide: detail.checked })}
                >
                  Hide split panel trigger
                </Toggle>
                <Toggle
                  checked={breadcrumbsHide}
                  onChange={({ detail }) => setUrlParams({ breadcrumbsHide: detail.checked })}
                >
                  Hide breadcrumbs
                </Toggle>

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
                <Button onClick={() => setSplitPanelOpen(true)}>Open split panel</Button>
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
          closeBehavior={splitPanelTriggerHide ? 'hide' : undefined}
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
      splitPanelOpen={splitPanelOpen}
      splitPanelPreferences={{
        position: urlParams.splitPanelPosition,
      }}
      onSplitPanelToggle={event => setSplitPanelOpen(event.detail.open)}
      onSplitPanelPreferencesChange={event => {
        const { position } = event.detail;
        setUrlParams({ splitPanelPosition: position === 'side' ? position : undefined });
      }}
      onToolsChange={event => {
        setIsToolsOpen(event.detail.open);
      }}
      tools={<Info helpPathSlug={helpPathSlug} />}
      toolsOpen={isToolsOpen}
      navigationOpen={isNavigationOpen}
      navigation={<Navigation />}
      onNavigationChange={event => setIsNavigationOpen(event.detail.open)}
      navigationTriggerHide={navigationTriggerHide}
      {...drawersProps}
    />
  );
}

function Info({ helpPathSlug }: { helpPathSlug: string }) {
  return <HelpPanel header={<h2>Info</h2>}>Here is some info for you: {helpPathSlug}</HelpPanel>;
}
