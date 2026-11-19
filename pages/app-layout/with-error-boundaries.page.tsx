// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef, useState } from 'react';

import { AppLayout, Button, Container, ContentLayout, Header, SpaceBetween, SplitPanel, Toggle } from '~components';
import { AppLayoutProps } from '~components/app-layout';
import BreadcrumbGroup from '~components/breadcrumb-group';
import ErrorBoundary from '~components/error-boundary';
import awsuiPlugins from '~components/internal/plugins';
import { registerBottomDrawer, registerLeftDrawer } from '~components/internal/plugins/widget';
import { mount, unmount } from '~mount';

import AppContext, { AppContextType } from '../app/app-context';
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
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const hasParentErrorBoundary = urlParams.hasParentErrorBoundary ?? false;
  const [isBrokenNavigation, setIsBrokenNavigation] = useState(false);
  const appLayoutRef = useRef<AppLayoutProps.Ref>(null);
  const [breadcrumbsItems, setBreadcrumbsItems] = useState([
    { text: 'Home', href: '#' },
    { text: 'Service', href: '#' },
  ]);

  useEffect(() => {
    window.addEventListener(
      'error',
      error => {
        console.log('The error gets caught by the global event handler: ', error);
      },
      true
    );
  }, []);

  const appLayout = (
    <AppLayout
      ariaLabels={{ ...appLayoutLabels, ...drawerLabels }}
      ref={appLayoutRef}
      breadcrumbs={<BreadcrumbGroup items={breadcrumbsItems} />}
      content={
        <AppLayout
          navigationHide={true}
          toolsHide={true}
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
                            // @ts-expect-error testing error boundaries with invalid react nodes
                            iconSvg: Symbol(),
                          },

                          mountContent: container => {
                            mount(<div>left drawer</div>, container);
                          },
                          unmountContent: container => unmount(container),
                        });
                      }}
                      data-testid="break-left-drawer-trigger"
                    >
                      Break left drawer trigger
                    </Button>
                    <Button
                      onClick={() => {
                        // @ts-expect-error testing error boundaries with invalid react nodes
                        setBreadcrumbsItems(null);
                      }}
                      data-testid="break-breadcrumbs"
                    >
                      Break breadcrumbs
                    </Button>
                    <Button
                      onClick={() => {
                        awsuiPlugins.appLayout.registerDrawer({
                          id: 'broken-local-drawer',
                          type: 'local',
                          trigger: {
                            // @ts-expect-error testing error boundaries with invalid react nodes
                            iconSvg: Symbol(),
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
                      data-testid="break-local-drawer-trigger"
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
                            // @ts-expect-error testing error boundaries with invalid react nodes
                            iconSvg: Symbol(),
                          },

                          mountContent: container => {
                            mount(<div>Hello!</div>, container);
                          },
                          unmountContent: container => unmount(container),
                        });
                      }}
                      data-testid="break-global-drawer-trigger"
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
                      data-testid="break-left-drawer-content"
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
                      data-testid="break-left-drawer-header"
                    >
                      Break left drawer header on mount
                    </Button>
                    <Button onClick={() => setIsBrokenNavigation(true)} data-testid="break-nav-panel">
                      Break nav panel
                    </Button>
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
                          },
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
                      data-testid="break-local-drawer-content"
                    >
                      Break local drawer on mount
                    </Button>
                    <Button
                      onClick={() => {
                        awsuiPlugins.appLayout.registerDrawer({
                          id: 'broken-global-drawer',
                          type: 'global',
                          trigger: {
                            iconSvg: `<svg viewBox="0 0 16 16" focusable="false"><circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="7" /><circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="3" /></svg>`,
                          },
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
                      data-testid="break-global-drawer-content"
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
                      data-testid="break-bottom-drawer-content"
                    >
                      Break bottom drawer on mount
                    </Button>
                  </Container>
                </SpaceBetween>
              </ContentLayout>
            </div>
          }
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
      toolsHide={true}
      navigation={isBrokenNavigation ? ({} as any) : <div>navigation</div>}
    />
  );

  return hasParentErrorBoundary ? (
    <ErrorBoundary
      onError={(error: any) =>
        console.log('The error gets caught by the parent error boundary wrapping app layout: ', error)
      }
    >
      {appLayout}
    </ErrorBoundary>
  ) : (
    appLayout
  );
}
