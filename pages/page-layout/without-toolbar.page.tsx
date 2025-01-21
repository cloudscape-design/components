// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import { Button, ContentLayout, Header, HelpPanel, Link, PageLayout, SpaceBetween } from '~components';
import { PageLayoutProps } from '~components/page-layout';

import { Containers, CustomDrawerContent, Navigation } from './utils/content-blocks';
import { drawerLabels } from './utils/drawers';
import appLayoutLabels from './utils/labels';

export default function WithDrawers() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [helpPathSlug, setHelpPathSlug] = useState<string>('default');
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(true);
  const appLayoutRef = useRef<PageLayoutProps.Ref>(null);

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
      ref={appLayoutRef}
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
                      appLayoutRef.current?.focusToolsClose();
                    }}
                  >
                    Info
                  </Link>
                }
              >
                Page layout without the toolbar
              </Header>

              <SpaceBetween size="xs">
                <Button onClick={() => setIsNavigationOpen(current => !current)}>Toggle navigation</Button>

                <Button
                  onClick={() => {
                    setActiveDrawerId('pro-help');
                    appLayoutRef.current?.focusActiveDrawer();
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
  );
}

function Info({ helpPathSlug }: { helpPathSlug: string }) {
  return <HelpPanel header={<h2>Info</h2>}>Here is some info for you: {helpPathSlug}</HelpPanel>;
}
