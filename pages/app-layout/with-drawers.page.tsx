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

type DemoContext = React.Context<
  AppContextType<{
    hasTools: boolean | undefined;
    hasBetaDrawers: boolean | undefined;
    hasPublicDrawers: boolean | undefined;
  }>
>;

const getAriaLabels = (title: string, badge: boolean) => {
  return {
    closeButton: `${title} close button`,
    content: `${title}`,
    triggerButton: `${title} trigger button${badge ? ' (Unread notifications)' : ''}`,
    resizeHandle: `${title} resize handle`,
  };
};

export default function WithDrawers() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [activePublicDrawerId, setActivePublicDrawerId] = useState<string | null>('pro-help');
  const hasTools = urlParams.hasTools ?? false;
  const hasBetaDrawers = urlParams.hasBetaDrawers ?? false;
  const hasPublicDrawers = urlParams.hasPublicDrawers ?? true;

  const drawerLabels = { drawers: 'Drawers', drawersOverflow: 'Drawers overflow' };

  const betaDrawers = !hasBetaDrawers
    ? null
    : {
        drawers: {
          ariaLabel: 'Drawers',
          overflowAriaLabel: 'Overflow drawers',
          activeDrawerId: activeDrawerId,
          items: [
            {
              ariaLabels: getAriaLabels('Security', false),
              content: <Security />,
              id: 'security',
              resizable: true,
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
              ariaLabels: getAriaLabels('Pro help', true),
              content: <ProHelp />,
              badge: true,
              defaultSize: 600,
              id: 'pro-help',
              trigger: {
                iconName: 'contact',
              },
            },
            {
              ariaLabels: getAriaLabels('Links', false),
              resizable: true,
              defaultSize: 500,
              content: <Links />,
              id: 'links',
              trigger: {
                iconName: 'share',
              },
            },
            {
              ariaLabels: getAriaLabels('Test 1', true),
              content: <HelpPanel header={<h2>Test 1</h2>}>Test 1.</HelpPanel>,
              badge: true,
              id: 'test-1',
              trigger: {
                iconName: 'contact',
              },
            },
            {
              ariaLabels: getAriaLabels('Test 2', false),
              resizable: true,
              defaultSize: 500,
              content: <HelpPanel header={<h2>Test 2</h2>}>Test 2.</HelpPanel>,
              id: 'test-2',
              trigger: {
                iconName: 'share',
              },
            },
            {
              ariaLabels: getAriaLabels('Test 3', true),
              content: <HelpPanel header={<h2>Test 3</h2>}>Test 3.</HelpPanel>,
              badge: true,
              id: 'test-3',
              trigger: {
                iconName: 'contact',
              },
            },
            {
              ariaLabels: getAriaLabels('Test 4', false),
              resizable: true,
              defaultSize: 500,
              content: <HelpPanel header={<h2>Test 4</h2>}>Test 4.</HelpPanel>,
              id: 'test-4',
              trigger: {
                iconName: 'edit',
              },
            },
            {
              ariaLabels: getAriaLabels('Test 5', false),
              resizable: true,
              defaultSize: 500,
              content: <HelpPanel header={<h2>Test 5</h2>}>Test 5.</HelpPanel>,
              id: 'test-5',
              trigger: {
                iconName: 'add-plus',
              },
            },
            {
              ariaLabels: getAriaLabels('Test 6', false),
              resizable: true,
              defaultSize: 500,
              content: <HelpPanel header={<h2>Test 6</h2>}>Test 6.</HelpPanel>,
              id: 'test-6',
              trigger: {
                iconName: 'call',
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
        ariaLabels={Object.assign(appLayoutLabels, drawerLabels)}
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
                    checked={hasTools}
                    onChange={e => {
                      setUrlParams({ hasTools: e.detail.checked });
                    }}
                  >
                    Has Tools
                  </Toggle>

                  <Toggle
                    checked={hasBetaDrawers}
                    onChange={({ detail }) => setUrlParams({ hasBetaDrawers: detail.checked })}
                    data-id="toggle-drawers"
                  >
                    Has Beta Drawers
                  </Toggle>

                  <Toggle
                    checked={hasPublicDrawers}
                    onChange={({ detail }) => setUrlParams({ hasPublicDrawers: detail.checked })}
                    data-id="toggle-public-drawers"
                  >
                    Has Public Drawers
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
        toolsHide={!hasTools}
        {...betaDrawers}
        activeDrawerId={!hasPublicDrawers ? undefined : activePublicDrawerId}
        onDrawerChange={
          !hasPublicDrawers
            ? undefined
            : ({ detail }) => {
                setActivePublicDrawerId(detail.activeDrawerId);
              }
        }
        publicDrawers={
          !hasPublicDrawers
            ? undefined
            : [
                {
                  ariaLabels: {
                    drawerName: 'pro-help',
                    closeButton: 'pro-help close',
                    triggerButton: 'pro-help trigger',
                    resizeHandle: 'pro-help resize',
                  },
                  content: <ProHelp />,
                  badge: true,
                  defaultSize: 600,
                  onResize: ({ detail }) => {
                    console.log('size is now', detail.size);
                  },
                  resizable: true,
                  id: 'pro-help',
                  trigger: {
                    iconName: 'contact',
                  },
                },
              ]
        }
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

function Links() {
  return <HelpPanel header={<h2>Links</h2>}>Here is a link.</HelpPanel>;
}
