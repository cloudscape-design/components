// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  AppLayout,
  Button,
  Container,
  ContentLayout,
  Header,
  HelpPanel,
  SpaceBetween,
  SplitPanel,
  Toggle,
} from '~components';
import { AppLayoutProps } from '~components/app-layout';
import BreadcrumbGroup from '~components/breadcrumb-group';
import ErrorBoundary from '~components/error-boundary';
import awsuiPlugins from '~components/internal/plugins';
import { registerBottomDrawer, registerLeftDrawer } from '~components/internal/plugins/widget';
import { mount, unmount } from '~mount';

import './utils/external-widget';
import AppContext, { AppContextType } from '../app/app-context';
import { IframeWrapper } from '../utils/iframe-wrapper';
import { CustomDrawerContent } from './utils/content-blocks';
import { drawerLabels } from './utils/drawers';
import appLayoutLabels from './utils/labels';
import { splitPaneli18nStrings } from './utils/strings';

type DemoContext = React.Context<
  AppContextType<{
    hasParentErrorBoundary: boolean | undefined;
    hasDrawers: boolean | undefined;
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
  }>
>;

export default function WithErrorBoundariesPage() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const hasParentErrorBoundary = urlParams.hasParentErrorBoundary ?? false;
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isBrokenNavigation, setIsBrokenNavigation] = useState(false);
  const appLayoutRef = useRef<AppLayoutProps.Ref>(null);
  const [breadcrumbsItems, setBreadcrumbsItems] = useState([
    { text: 'Home', href: '#' },
    { text: 'Service', href: '#' },
  ]);
  const drawersProps: Pick<AppLayoutProps, 'activeDrawerId' | 'onDrawerChange' | 'drawers'> | null = {
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

  useEffect(() => {
    window.addEventListener(
      'error',
      error => {
        console.log('The error gets caught by the global event handler: ', error);
      },
      true
    );
  }, []);

  const AppLayoutWrapper = hasParentErrorBoundary ? ErrorBoundary : 'div';
  const appLayoutWrapperProps = hasParentErrorBoundary
    ? {
        onError: (error: any) =>
          console.log('The error gets caught by the parent error boundary wrapping app layout: ', error),
      }
    : {};

  return (
    <AppLayoutWrapper {...(appLayoutWrapperProps as any)}>
      <AppLayout
        ariaLabels={{ ...appLayoutLabels, ...drawerLabels }}
        ref={appLayoutRef}
        breadcrumbs={<BreadcrumbGroup items={breadcrumbsItems} />}
        content={
          <IframeWrapper
            id="error-boundaries"
            AppComponent={() => (
              <AppLayout
                navigationHide={true}
                content={
                  <div data-testid="app-layout-content-area">
                    <ContentLayout
                      disableOverlap={true}
                      header={
                        <SpaceBetween size="m">
                          <Header variant="h1">Error boundaries in app layout slots</Header>
                        </SpaceBetween>
                      }
                    >
                      <SpaceBetween size="xs">
                        <Toggle
                          checked={hasParentErrorBoundary}
                          onChange={({ detail }) => setUrlParams({ hasParentErrorBoundary: detail.checked })}
                        >
                          Has parent error boundary
                        </Toggle>
                        <Container header={<Header>Toolbar</Header>}>
                          <Button
                            onClick={() => {
                              registerLeftDrawer({
                                id: 'ai-panel',
                                resizable: true,
                                isExpandable: true,
                                defaultSize: 300,
                                preserveInactiveContent: true,

                                ariaLabels: {
                                  closeButton: 'Close AI Panel drawer',
                                  content: 'AI Panel',
                                  triggerButton: 'AI Panel',
                                  resizeHandle: 'Resize handle',
                                  expandedModeButton: 'Expanded mode button',
                                  exitExpandedModeButton: 'Console',
                                },

                                trigger: {
                                  iconSvg: Symbol() as any,
                                },

                                mountContent: container => {
                                  mount(<div>left drawer</div>, container);
                                },
                                unmountContent: container => unmount(container),
                              });
                            }}
                          >
                            Break left drawer trigger
                          </Button>
                          <Button
                            onClick={() => {
                              setBreadcrumbsItems(null as any);
                            }}
                          >
                            Break breadcrumbs
                          </Button>
                          <Button
                            onClick={() => {
                              awsuiPlugins.appLayout.registerDrawer({
                                id: 'broken-local-drawer',
                                type: 'local',
                                trigger: {
                                  iconSvg: Symbol() as any,
                                },
                                defaultActive: false,

                                ariaLabels: {
                                  closeButton: 'Close button',
                                  content: 'Content',
                                  triggerButton: 'Trigger button',
                                  resizeHandle: 'Resize handle',
                                },

                                mountContent: container => {
                                  mount(<div>sdfsdf</div>, container);
                                },
                                unmountContent: () => {},
                              });
                            }}
                          >
                            Break a local drawer
                          </Button>
                          <Button
                            onClick={() => {
                              awsuiPlugins.appLayout.registerDrawer({
                                id: 'broken-global-drawer',
                                type: 'global',
                                defaultActive: false,
                                resizable: true,
                                defaultSize: 320,
                                orderPriority: -1,

                                ariaLabels: {
                                  closeButton: 'Close button',
                                  content: 'Content',
                                  triggerButton: 'Trigger button',
                                  resizeHandle: 'Resize handle',
                                },

                                trigger: {
                                  iconSvg: Symbol() as any,
                                },

                                mountContent: container => {
                                  mount(<div>Hello!</div>, container);
                                },
                                unmountContent: container => unmount(container),
                              });
                            }}
                          >
                            Break a global drawer
                          </Button>
                        </Container>
                        <Container header={<Header>Panels</Header>}>
                          <Button
                            onClick={() => {
                              registerLeftDrawer({
                                id: 'ai-panel',
                                resizable: true,
                                isExpandable: true,
                                defaultSize: 300,
                                preserveInactiveContent: true,
                                defaultActive: true,

                                ariaLabels: {
                                  closeButton: 'Close AI Panel drawer',
                                  content: 'AI Panel',
                                  triggerButton: 'AI Panel',
                                  resizeHandle: 'Resize handle',
                                  expandedModeButton: 'Expanded mode button',
                                  exitExpandedModeButton: 'Console',
                                },

                                trigger: {
                                  customIcon: '',
                                },

                                mountContent: () => {
                                  throw new Error('Mount error in drawer content');
                                },
                                unmountContent: container => unmount(container),
                              });
                            }}
                          >
                            Break left drawer content on mount
                          </Button>
                          <Button
                            onClick={() => {
                              registerLeftDrawer({
                                id: 'ai-panel',
                                resizable: true,
                                isExpandable: true,
                                defaultSize: 300,
                                preserveInactiveContent: true,
                                defaultActive: true,

                                ariaLabels: {
                                  closeButton: 'Close AI Panel drawer',
                                  content: 'AI Panel',
                                  triggerButton: 'AI Panel',
                                  resizeHandle: 'Resize handle',
                                  expandedModeButton: 'Expanded mode button',
                                  exitExpandedModeButton: 'Console',
                                },

                                trigger: {
                                  customIcon: '',
                                },

                                mountHeader: () => {
                                  throw new Error('Mount error in drawer content');
                                },
                                unmountHeader: container => unmount(container),
                                mountContent: container => {
                                  container.innerHTML = 'hello!';
                                },
                                unmountContent: container => unmount(container),
                              });
                            }}
                          >
                            Break left drawer header on mount
                          </Button>
                          <Button onClick={() => setIsBrokenNavigation(true)}>Break nav panel</Button>
                          <Button
                            onClick={() => {
                              awsuiPlugins.appLayout.registerDrawer({
                                id: 'broken-local-drawer',
                                type: 'local',
                                trigger: {
                                  iconSvg: `<svg viewBox="0 0 16 16" focusable="false">
          <circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="7" />
          <circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="3" />
        </svg>`,
                                } as any,
                                defaultActive: true,

                                ariaLabels: {
                                  closeButton: 'Close button',
                                  content: 'Content',
                                  triggerButton: 'Trigger button',
                                  resizeHandle: 'Resize handle',
                                },

                                mountContent: () => {
                                  // Simulate error during mount
                                  throw new Error('Mount error in drawer content');
                                },
                                unmountContent: () => {},
                              });
                            }}
                          >
                            Break local drawer on mount
                          </Button>
                          <Button
                            onClick={() => {
                              awsuiPlugins.appLayout.registerDrawer({
                                id: 'broken-global-drawer',
                                type: 'global',
                                trigger: {
                                  iconSvg: `<svg viewBox="0 0 16 16" focusable="false">
          <circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="7" />
          <circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="3" />
        </svg>`,
                                } as any,
                                defaultActive: true,

                                ariaLabels: {
                                  closeButton: 'Close button',
                                  content: 'Content',
                                  triggerButton: 'Trigger button',
                                  resizeHandle: 'Resize handle',
                                },

                                mountContent: () => {
                                  // Simulate error during mount
                                  throw new Error('Mount error in drawer content');
                                },
                                unmountContent: () => {},
                              });
                            }}
                          >
                            Break global drawer on mount
                          </Button>
                          <Button
                            onClick={() => {
                              registerBottomDrawer({
                                id: 'bottom-panel',
                                resizable: true,
                                isExpandable: true,
                                defaultSize: 300,
                                preserveInactiveContent: true,
                                defaultActive: true,

                                ariaLabels: {
                                  closeButton: 'Close AI Panel drawer',
                                  content: 'AI Panel',
                                  triggerButton: 'AI Panel',
                                  resizeHandle: 'Resize handle',
                                  expandedModeButton: 'Expanded mode button',
                                  exitExpandedModeButton: 'Console',
                                },

                                trigger: {
                                  customIcon: '',
                                },

                                mountContent: () => {
                                  throw new Error('Mount error in drawer content');
                                },
                                unmountContent: container => unmount(container),
                              });
                            }}
                          >
                            Break bottom drawer on mount
                          </Button>
                        </Container>
                      </SpaceBetween>
                    </ContentLayout>
                  </div>
                }
              />
            )}
          />
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
        tools={<Info helpPathSlug="default" />}
        toolsOpen={isToolsOpen}
        navigation={isBrokenNavigation ? ({} as any) : <div>navigation</div>}
        {...drawersProps}
      />
    </AppLayoutWrapper>
  );
}

function Info({ helpPathSlug }: { helpPathSlug: string }) {
  return <HelpPanel header={<h2>Info</h2>}>Here is some info for you: {helpPathSlug}</HelpPanel>;
}
