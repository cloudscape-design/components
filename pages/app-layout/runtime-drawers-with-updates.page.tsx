// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useState } from 'react';

import { AppLayout, ContentLayout, Header, HelpPanel, Link, SpaceBetween, Toggle } from '~components';
import { AppLayoutProps } from '~components/app-layout';
import awsuiPlugins from '~components/internal/plugins';

import './utils/external-widget';
import AppContext, { AppContextType } from '../app/app-context';
import { Breadcrumbs, Containers } from './utils/content-blocks';
import appLayoutLabels from './utils/labels';

type DemoContext = React.Context<
  AppContextType<{
    hasTools: boolean | undefined;
    showBadge: boolean | undefined;
    turnOffResizable: boolean | undefined;
    increaseDrawerSize: boolean | undefined;
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
  }>
>;

export default function WithDrawers() {
  const [helpPathSlug, setHelpPathSlug] = useState<string>('default');
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const { increaseDrawerSize = false, hasTools = false, showBadge = false, turnOffResizable = false } = urlParams;
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  useEffect(() => {
    awsuiPlugins.appLayout.updateDrawer({
      id: 'security',
      badge: showBadge,
      resizable: !turnOffResizable,
      defaultSize: increaseDrawerSize ? 440 : 320,
    });
  }, [showBadge, turnOffResizable, increaseDrawerSize]);

  return (
    <AppLayout
      ariaLabels={appLayoutLabels}
      breadcrumbs={<Breadcrumbs />}
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
                    }}
                  >
                    Info
                  </Link>
                }
              >
                Testing Custom Drawers with updates!
              </Header>

              <SpaceBetween size="xs">
                <Toggle checked={hasTools} onChange={({ detail }) => setUrlParams({ hasTools: detail.checked })}>
                  Use Tools
                </Toggle>

                <Header variant="h2">Security Drawer Updates</Header>
                <Toggle
                  data-testid="show-badge-toggle"
                  checked={showBadge}
                  onChange={({ detail }) => setUrlParams({ showBadge: detail.checked })}
                >
                  Show Badge
                </Toggle>
                <Toggle
                  data-testid="turn-off-resize-toggle"
                  checked={turnOffResizable}
                  onChange={({ detail }) => setUrlParams({ turnOffResizable: detail.checked })}
                >
                  Turn off Resize
                </Toggle>
                <Toggle
                  data-testid="increase-drawer-size-toggle"
                  checked={increaseDrawerSize}
                  onChange={({ detail }) => setUrlParams({ increaseDrawerSize: detail.checked })}
                >
                  Increase Drawer Size
                </Toggle>
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
      toolsHide={!hasTools}
    />
  );
}

function Info({ helpPathSlug }: { helpPathSlug: string }) {
  return <HelpPanel header={<h2>Info</h2>}>Here is some info for you: {helpPathSlug}</HelpPanel>;
}
