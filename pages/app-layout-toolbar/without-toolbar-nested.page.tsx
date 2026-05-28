// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';

import { AppLayoutToolbar, Button, ContentLayout, Header, HelpPanel, Link, SpaceBetween, Toggle } from '~components';
import { AppLayoutToolbarProps } from '~components/app-layout-toolbar';
import { registerLeftDrawer, updateDrawer } from '~components/internal/plugins/widget';

import AppContext, { AppContextType } from '../app/app-context';
import { Containers, CustomDrawerContent, Navigation } from '../app-layout/utils/content-blocks';
import { drawerLabels } from '../app-layout/utils/drawers';
import { leftDrawerPayload } from '../app-layout/utils/external-global-left-panel-widget';
import appLayoutLabels from '../app-layout/utils/labels';
import { IframeWrapper } from '../utils/iframe-wrapper';
import ScreenshotArea from '../utils/screenshot-area';

registerLeftDrawer({ ...leftDrawerPayload, defaultActive: true });

type DemoContext = React.Context<
  AppContextType<{
    hasNestedIframe: boolean | undefined;
  }>
>;

export default function WithoutToolbar() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [helpPathSlug, setHelpPathSlug] = useState<string>('default');
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(true);
  const pageLayoutRef = useRef<AppLayoutToolbarProps.Ref>(null);
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);

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
      },
    ],
    onDrawerChange: event => {
      setActiveDrawerId(event.detail.activeDrawerId);
    },
  };

  const renderInternalAppLayout = () => (
    <AppLayoutToolbar
      toolsHide={true}
      navigationHide={true}
      navigationTriggerHide={true}
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
                Page layout without the toolbar
              </Header>

              <SpaceBetween size="xs">
                <Toggle
                  checked={urlParams.hasNestedIframe ?? false}
                  onChange={event => {
                    setUrlParams({ hasNestedIframe: event.detail.checked });
                  }}
                >
                  Has nested iframe
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
                <Button onClick={() => updateDrawer({ type: 'openDrawer', payload: { id: 'ai-panel' } })}>
                  Open the left panel
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
    />
  );

  return (
    <ScreenshotArea gutters={false}>
      <AppLayoutToolbar
        {...{ __forceEnableRuntimeMessages: true }}
        ariaLabels={{ ...appLayoutLabels, ...drawerLabels }}
        ref={pageLayoutRef}
        content={
          urlParams.hasNestedIframe ? (
            <IframeWrapper id="smth" AppComponent={renderInternalAppLayout} />
          ) : (
            renderInternalAppLayout()
          )
        }
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
    </ScreenshotArea>
  );
}

function Info({ helpPathSlug }: { helpPathSlug: string }) {
  return <HelpPanel header={<h2>Info</h2>}>Here is some info for you: {helpPathSlug}</HelpPanel>;
}
