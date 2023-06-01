// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useContext } from 'react';
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
import type { DrawerItem } from '~components/app-layout/drawer/interfaces';
import AppContext, { AppContextType } from '../app/app-context';

type DemoContext = React.Context<AppContextType<{ hasTools: boolean }>>;

export default function WithDrawers() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [hasDrawers, setHasDrawers] = useState(true);
  const [hideTools, setHideTools] = useState(!urlParams.hasTools);

  const drawers = !hasDrawers
    ? null
    : {
        drawers: {
          ariaLabel: 'Drawers',
          activeDrawerId: activeDrawerId,
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
              defaultSize: 500,
              onResize: ({ detail: { size } }) => {
                // A drawer implementer may choose to listen to THEIR drawer's
                // resize event,should they want to persist, or otherwise respond
                // to their drawer being resized.
                console.log('Security Drawer is now: ', size);
              },
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
              resizable: true,
              defaultSize: 10000,
              content: <ProHelp />,
              id: 'pro-help',
              trigger: {
                iconName: 'contact',
              },
            },
          ] as DrawerItem[],
          onChange: (event: NonCancelableCustomEvent<string>) => {
            setActiveDrawerId(event.detail);
          },
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
                  <Toggle
                    checked={!hideTools}
                    onChange={e => {
                      setHideTools(!e.detail.checked);
                      setUrlParams({ hasTools: e.detail.checked });
                    }}
                  >
                    Has Tools
                  </Toggle>

                  <Toggle
                    checked={hasDrawers}
                    onChange={({ detail }) => setHasDrawers(detail.checked)}
                    data-id="toggle-drawers"
                  >
                    Has Drawers
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
        tools={<Info />}
        toolsHide={hideTools}
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
