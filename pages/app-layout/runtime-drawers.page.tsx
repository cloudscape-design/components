// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';

import {
  AppLayout,
  Button,
  ContentLayout,
  Drawer,
  Header,
  HelpPanel,
  Link,
  SpaceBetween,
  SplitPanel,
  Toggle,
} from '~components';
import { AppLayoutProps } from '~components/app-layout';
import awsuiPlugins from '~components/internal/plugins';

import './utils/external-widget';
import AppContext, { AppContextType } from '../app/app-context';
import { Breadcrumbs, Containers } from './utils/content-blocks';
import appLayoutLabels from './utils/labels';

type DemoContext = React.Context<
  AppContextType<{
    hasTools: boolean | undefined;
    hasDrawers: boolean | undefined;
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
  }>
>;

export default function WithDrawers() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [helpPathSlug, setHelpPathSlug] = useState<string>('default');
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const hasTools = urlParams.hasTools ?? false;
  const hasDrawers = urlParams.hasDrawers ?? true;
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const appLayoutRef = useRef<AppLayoutProps.Ref>(null);

  const drawersProps: Pick<AppLayoutProps, 'activeDrawerId' | 'onDrawerChange' | 'drawers'> | null = !hasDrawers
    ? null
    : {
        activeDrawerId: activeDrawerId,
        drawers: [
          {
            ariaLabels: {
              closeButton: 'ProHelp close button',
              drawerName: 'ProHelp drawer content',
              triggerButton: 'ProHelp trigger button',
              resizeHandle: 'ProHelp resize handle',
            },
            content: <ProHelp />,
            id: 'pro-help',
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
    <AppLayout
      ariaLabels={appLayoutLabels}
      breadcrumbs={<Breadcrumbs />}
      ref={appLayoutRef}
      content={
        <ContentLayout
          disableOverlap={true}
          header={
            <SpaceBetween size="m">
              <Header
                variant="h1"
                description="Sometimes you need custom drawers to get the job done."
                info={
                  <Link
                    data-testid="info-link-header"
                    variant="info"
                    onFollow={() => {
                      setHelpPathSlug('header');
                      setIsToolsOpen(true);
                      appLayoutRef.current?.focusToolsClose();
                    }}
                  >
                    Info
                  </Link>
                }
              >
                Testing Custom Drawers!
              </Header>

              <SpaceBetween size="xs">
                <Toggle checked={hasTools} onChange={({ detail }) => setUrlParams({ hasTools: detail.checked })}>
                  Use Tools
                </Toggle>

                <Toggle checked={hasDrawers} onChange={({ detail }) => setUrlParams({ hasDrawers: detail.checked })}>
                  Use Drawers
                </Toggle>

                <Button onClick={() => awsuiPlugins.appLayout.openDrawer('circle4-global')}>
                  Open a drawer without a trigger
                </Button>
                <Button onClick={() => awsuiPlugins.appLayout.closeDrawer('circle4-global')}>
                  Close a drawer without a trigger
                </Button>
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
      toolsHide={!hasTools}
      {...drawersProps}
    />
  );
}

function Info({ helpPathSlug }: { helpPathSlug: string }) {
  return <HelpPanel header={<h2>Info</h2>}>Here is some info for you: {helpPathSlug}</HelpPanel>;
}

function ProHelp() {
  return <Drawer header={<h2>Pro Help</h2>}>Need some Pro Help? We got you.</Drawer>;
}
