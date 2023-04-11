// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import {
  AppLayout,
  ContentLayout,
  Header,
  HelpPanel,
  NonCancelableCustomEvent,
  SpaceBetween,
  SplitPanel,
  Toggle,
} from '~components';
import appLayoutLabels from './utils/labels';
import { Breadcrumbs, Containers } from './utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';

export default function WithDrawers() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [hasDrawers, setHasDrawers] = useState(true);
  const [hasTools, setHasTools] = useState(true);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [drawersWidths, setDrawersWidths] = useState([
    { id: 'security', size: 500 },
    { id: 'pro-help', size: 280 },
  ]);

  const drawers = !hasDrawers
    ? null
    : {
        drawers: {
          ariaLabel: 'Drawers',
          activeDrawerId: activeDrawerId,
          onResize: (event: NonCancelableCustomEvent<{ size: number; id: string }>) => {
            setDrawersWidths([{ id: event.detail.id, size: event.detail.size }]);
          },
          items: [
            {
              ariaLabels: {
                closeButton: 'Security close button',
                content: 'Security drawer content',
                triggerButton: 'Security trigger button',
                resizeHandle: 'Security resize handle',
              },
              content: <Security />,
              id: 'security',
              resizable: true,
              size: drawersWidths.find(drawer => drawer.id === 'security')?.size,

              trigger: {
                iconName: 'security',
              },
            },
            {
              ariaLabels: {
                closeButton: 'ProHelp close button',
                content: 'ProHelp drawer content',
                triggerButton: 'ProHelp trigger button',
                resizeHandle: 'ProHelp resize handle',
              },
              content: <ProHelp />,
              resizable: true,
              size: drawersWidths.find(drawer => drawer.id === 'pro-help')?.size,
              id: 'pro-help',
              trigger: {
                iconName: 'contact',
              },
            },
          ],
          onChange: (event: NonCancelableCustomEvent<string>) => setActiveDrawerId(event.detail),
        },
      };

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={appLayoutLabels}
        breadcrumbs={<Breadcrumbs />}
        content={
          <ContentLayout
            header={
              <SpaceBetween size="m">
                <Header variant="h1" description="Sometimes you need custom drawers to get the job done.">
                  Testing Custom Drawers!
                </Header>

                <SpaceBetween size="xs">
                  <Toggle checked={hasTools} onChange={({ detail }) => setHasTools(detail.checked)}>
                    Use Tools
                  </Toggle>

                  <Toggle checked={hasDrawers} onChange={({ detail }) => setHasDrawers(detail.checked)}>
                    Use Drawers
                  </Toggle>
                </SpaceBetween>
              </SpaceBetween>
            }
          >
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
        onToolsChange={event => {
          setIsToolsOpen(event.detail.open);
        }}
        tools={<Info />}
        toolsOpen={isToolsOpen}
        toolsHide={!hasTools}
        {...drawers}
      />
    </ScreenshotArea>
  );
}

function Info() {
  return <HelpPanel header={<h2>Info</h2>}>Here is some info for you!</HelpPanel>;
}

function Security() {
  return <HelpPanel header={<h2>Security</h2>}>Everyone needs it.</HelpPanel>;
}

function ProHelp() {
  return <HelpPanel header={<h2>Pro Help</h2>}>Need some Pro Help? We got you.</HelpPanel>;
}
