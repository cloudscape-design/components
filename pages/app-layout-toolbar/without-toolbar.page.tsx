// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import { AppLayoutToolbar, Button, ContentLayout, Header, HelpPanel, Link, SpaceBetween } from '~components';
import { AppLayoutToolbarProps } from '~components/app-layout-toolbar';

import { Containers, CustomDrawerContent, Navigation } from '../app-layout/utils/content-blocks';
import { drawerLabels } from '../app-layout/utils/drawers';
import appLayoutLabels from '../app-layout/utils/labels';
import ScreenshotArea from '../utils/screenshot-area';

export default function WithDrawers() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [helpPathSlug, setHelpPathSlug] = useState<string>('default');
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(true);
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
      },
    ],
    onDrawerChange: event => {
      setActiveDrawerId(event.detail.activeDrawerId);
    },
  };

  return (
    <ScreenshotArea gutters={false}>
      <AppLayoutToolbar
        ariaLabels={{ ...appLayoutLabels, ...drawerLabels }}
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
                  Page layout without the toolbar
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
