// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';

import {
  AppLayout,
  Box,
  Button,
  ContentLayout,
  Header,
  HelpPanel,
  Link,
  SpaceBetween,
  SplitPanel,
  Toggle,
} from '~components';
import { AppLayoutProps } from '~components/app-layout';
import { useMobile } from '~components/internal/hooks/use-mobile';
import awsuiPlugins from '~components/internal/plugins';

import './utils/external-widget';
import AppContext, { AppContextType } from '../app/app-context';
import { Breadcrumbs, Containers, CustomDrawerContent } from './utils/content-blocks';
import { drawerLabels } from './utils/drawers';
import { AutoIncrementCounter } from './utils/external-widget';
import appLayoutLabels from './utils/labels';
import { splitPaneli18nStrings } from './utils/strings';

type DemoContext = React.Context<
  AppContextType<{
    hasTools: boolean | undefined;
    hasDrawers: boolean | undefined;
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
  }>
>;

const AIDrawer = () => {
  const isMobile = useMobile();

  return (
    <div
      style={{
        background: 'white',
        paddingInlineEnd: isMobile ? undefined : '16px',
      }}
    >
      <Box variant="h2" padding={{ bottom: 'm' }}>
        Chat demo
      </Box>
      <AutoIncrementCounter />
      {new Array(100).fill(null).map((_, index) => (
        <div key={index}>Tela content</div>
      ))}
    </div>
  );
};

awsuiPlugins.appLayout.registerDrawer({
  id: 'amazon-q',
  type: 'global-ai',
  resizable: true,
  isExpandable: true,
  defaultSize: 500,
  preserveInactiveContent: false,

  ariaLabels: {
    closeButton: 'Close button',
    content: 'Content',
    triggerButton: 'Trigger button for ai drawer',
    resizeHandle: 'Resize handle',
  },

  trigger: {
    iconSvg: `
      <svg width="58" height="32" viewBox="0 0 58 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="58" height="32" rx="4" fill="url(#paint0_radial_102_125756)"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M29.8558 15.5099V16.3724L29.1338 16.8195L28.4016 16.3714V15.5109L29.1338 15.0659L29.8558 15.5099ZM29.3719 22.919C29.2192 23.0015 29.0379 23.0015 28.8851 22.919L23.2842 19.8761C23.1202 19.7875 23.0184 19.6164 23.0184 19.4291V12.5663C23.0184 12.38 23.1212 12.2089 23.2852 12.1193L28.8872 9.08148C28.9625 9.03972 29.045 9.01936 29.1285 9.01936C29.212 9.01936 29.2945 9.03972 29.3709 9.08148L34.9719 12.1193C35.1369 12.2089 35.2387 12.38 35.2387 12.5663V19.1144L30.874 16.376V15.2253C30.874 15.0481 30.7824 14.8841 30.6316 14.7914L29.4015 14.0358C29.2395 13.937 29.0338 13.936 28.8699 14.0348L27.6275 14.7904C27.4757 14.8831 27.3831 15.047 27.3831 15.2253V16.6571C27.3831 16.8343 27.4757 16.9982 27.6275 17.0909L28.8689 17.8516C28.9503 17.9025 29.042 17.927 29.1346 17.927C29.2273 17.927 29.321 17.9015 29.4025 17.8506L30.3628 17.2569L34.7397 20.0034L29.3719 22.919ZM35.4577 11.2236L29.8577 8.18687C29.4004 7.93737 28.8566 7.93839 28.4004 8.18585L22.7994 11.2236C22.3065 11.4915 22 12.0057 22 12.5658V19.4286C22 19.9897 22.3065 20.504 22.7984 20.7708L28.3994 23.8136C28.6275 23.9379 28.878 24 29.1285 24C29.3791 24 29.6296 23.9379 29.8577 23.8136L35.4587 20.7708C35.9505 20.504 36.2571 19.9897 36.2571 19.4286V12.5658C36.2571 12.0057 35.9505 11.4915 35.4577 11.2236Z" fill="white"/>
        <defs>
          <radialGradient id="paint0_radial_102_125756" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(63.1768 -2.85617) rotate(151.113) scale(78.0669 84.498)">
            <stop stop-color="#B8E7FF"/>
            <stop offset="0.3" stop-color="#0099FF"/>
            <stop offset="0.45" stop-color="#5C7FFF"/>
            <stop offset="0.6" stop-color="#8575FF"/>
            <stop offset="0.8" stop-color="#962EFF"/>
          </radialGradient>
        </defs>
      </svg>
    `,
  },

  onResize: event => {
    console.log('resize', event.detail);
  },
  onToggle: event => {
    console.log('toggle', event.detail);
  },

  mountContent: container => {
    ReactDOM.render(<AIDrawer />, container);
  },
  unmountContent: container => unmountComponentAtNode(container),
});

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
            content: <CustomDrawerContent />,
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
      ariaLabels={{ ...appLayoutLabels, ...drawerLabels }}
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

                <Button
                  onClick={() => awsuiPlugins.appLayout.openDrawer('circle4-global')}
                  data-testid="open-drawer-button"
                >
                  Open a drawer without a trigger
                </Button>
                <Button onClick={() => awsuiPlugins.appLayout.closeDrawer('circle4-global')}>
                  Close a drawer without a trigger
                </Button>

                <Button
                  onClick={() => awsuiPlugins.appLayout.resizeDrawer('circle-global', 400)}
                  data-testid="button-circle-global-resize"
                >
                  Resize circle-global drawer to 400px
                </Button>
                <Button
                  onClick={() => awsuiPlugins.appLayout.resizeDrawer('circle3-global', 500)}
                  data-testid="button-circle3-global-resize"
                >
                  Resize circle3-global drawer to 500px
                </Button>

                <Button onClick={() => awsuiPlugins.appLayout.openDrawer('amazon-q')} data-testid="open-drawer-button">
                  Open the left global drawer
                </Button>
                <Button onClick={() => awsuiPlugins.appLayout.closeDrawer('amazon-q')}>
                  Close the left global drawer
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
        <SplitPanel header="Split panel header" i18nStrings={splitPaneli18nStrings}>
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
