// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Badge from '~components/badge';
import Button from '~components/button';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import SplitPanel from '~components/split-panel';
import Toggle from '~components/toggle';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Containers, Navigation, ScrollableDrawerContent, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import { splitPaneli18nStrings } from './utils/strings';
import * as toolsContent from './utils/tools-content';

type SplitPanelDemoContext = React.Context<
  AppContextType<{
    renderBadge: boolean;
    renderActions: boolean;
    renderInfoLink: boolean;
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
  }>
>;

export default function () {
  const { urlParams, setUrlParams } = useContext(AppContext as SplitPanelDemoContext);

  const header =
    urlParams.renderActions || urlParams.renderBadge || urlParams.renderInfoLink
      ? 'This split panel can be opened only by clicking on the caret icon becaues the header has custm elements'
      : 'This split panel can be opened by clicking anywhere on it because the header has no custom elements';

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        tools={<Tools>{toolsContent.long}</Tools>}
        splitPanelPreferences={{
          position: urlParams.splitPanelPosition,
        }}
        onSplitPanelPreferencesChange={event => {
          const { position } = event.detail;
          setUrlParams({ splitPanelPosition: position === 'side' ? position : undefined });
        }}
        splitPanel={
          <SplitPanel
            header={header}
            i18nStrings={splitPaneli18nStrings}
            headerBefore={urlParams.renderBadge && <Badge>Badge</Badge>}
            headerActions={
              urlParams.renderActions && (
                <SpaceBetween direction="horizontal" size="xs">
                  <Button>Button</Button>
                  <Button>Button</Button>
                </SpaceBetween>
              )
            }
            headerInfo={urlParams.renderInfoLink && <Link variant="info">Info</Link>}
          >
            <ScrollableDrawerContent />
          </SplitPanel>
        }
        content={
          <>
            <div style={{ marginBottom: '1rem' }}>
              <Header variant="h1" description="Basic demo with split panel">
                Demo page
              </Header>
            </div>
            <SpaceBetween size="l">
              <SpaceBetween direction="horizontal" size="xs">
                <Toggle
                  checked={urlParams.renderBadge}
                  onChange={({ detail }) => setUrlParams({ ...urlParams, renderBadge: detail.checked })}
                >
                  With badge
                </Toggle>
                <Toggle
                  checked={urlParams.renderInfoLink}
                  onChange={({ detail }) => setUrlParams({ ...urlParams, renderInfoLink: detail.checked })}
                >
                  With info link
                </Toggle>
                <Toggle
                  checked={urlParams.renderActions}
                  onChange={({ detail }) => setUrlParams({ ...urlParams, renderActions: detail.checked })}
                >
                  With action buttons
                </Toggle>
              </SpaceBetween>
              <Containers />
            </SpaceBetween>
          </>
        }
      />
    </ScreenshotArea>
  );
}
