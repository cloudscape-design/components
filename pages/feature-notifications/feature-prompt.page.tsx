// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef } from 'react';

import {
  AppLayoutProps,
  AppLayoutToolbar,
  Badge,
  Box,
  Button,
  Container,
  Header,
  Icon,
  Link,
  SpaceBetween,
  Toggle,
} from '~components';
import { I18nProvider } from '~components/i18n';
import messages from '~components/i18n/messages/all.all';
import FeaturePrompt, { FeaturePromptProps } from '~components/internal/do-not-use/feature-prompt';
import awsuiPlugins from '~components/internal/plugins';
import {
  clearFeatureNotifications,
  FeatureNotificationsPersistenceConfig,
  registerFeatureNotifications,
  showFeaturePromptIfPossible,
} from '~components/internal/plugins/widget';
import { mount, unmount } from '~mount';

import AppContext, { AppContextType } from '../app/app-context';
import { Breadcrumbs, Containers, Navigation, Tools } from '../app-layout/utils/content-blocks';
import labels from '../app-layout/utils/labels';
import * as toolsContent from '../app-layout/utils/tools-content';
import { IframeWrapper } from '../utils/iframe-wrapper';
import ScreenshotArea from '../utils/screenshot-area';

awsuiPlugins.appLayout.registerDrawer({
  id: 'security',

  ariaLabels: {
    closeButton: 'Security close button',
    content: 'Security drawer content',
    triggerButton: 'Security trigger button',
    resizeHandle: 'Security resize handle',
  },

  trigger: {
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <rect x="2" y="7" width="12" height="7" fill="none" stroke="currentColor" stroke-width="2" />
      <path d="M4,7V5a4,4,0,0,1,8,0V7" fill="none" stroke="currentColor" stroke-width="2" />
    </svg>`,
  },

  onToggle: event => {
    console.log('security drawer on toggle', event.detail);
    awsuiPlugins.appLayout.updateDrawer({ id: 'security', defaultActive: event.detail.isOpen });
  },

  resizable: true,
  defaultSize: 320,

  onResize: event => {
    awsuiPlugins.appLayout.updateDrawer({ id: 'security', defaultSize: event.detail.size });
  },

  mountContent: container => {
    mount(<div>sldkfjsdkl</div>, container);
  },
  unmountContent: container => unmount(container),
  headerActions: [
    {
      type: 'icon-button',
      id: 'add',
      iconName: 'add-plus',
      text: 'Add',
    },
  ],
  onHeaderActionClick: ({ detail }) => {
    console.log('onHeaderActionClick: ', detail);
  },
});

registerFeatureNotifications({
  id: 'local-feature-notifications',
  suppressFeaturePrompt: false,
  featuresPageLink: '/#/feature-notifications/feature-prompt?appLayoutToolbar=true',
  // by default all features older than 90 days old are filtered out,
  // so to keep them stable this function needs to always return true
  filterFeatures: () => true,
  features: [
    {
      id: '1',
      header: <Box fontWeight="bold">New feature, events with more resource tags</Box>,
      content: (
        <Box variant="p">
          You can now enrich CloudTrail events with additional information by adding resources tags and IAM global keys
          in CloudTrail lake.{' '}
          <Link variant="primary" external={true} href="https://amazon.com">
            Learn more
          </Link>
        </Box>
      ),
      contentCategory: (
        <Box fontSize="body-s" color="text-label">
          Event coverage
        </Box>
      ),
      releaseDate: new Date('2025-11-01'),
    },
    {
      id: '2',
      header: (
        <Box fontWeight="bold">Enhanced filtering options for CloudTrail events ingested into event data stores</Box>
      ),
      content: (
        <>
          <Box variant="p">
            More enhanced filtering options provide tighter control over your AWS activity data, improving the
            efficiency and precision of security, compliance, and operational investigations.{' '}
            <Link variant="primary" external={true} href="https://amazon.com">
              View user guide
            </Link>
          </Box>
          <Box margin={{ top: 'xs' }}>
            <Button>Create an Enhanced trail</Button>
          </Box>
        </>
      ),
      releaseDate: new Date('2025-07-28'),
    },
    {
      id: '3',
      header: <Box fontWeight="bold">Introducing Application Map</Box>,
      content: (
        <>
          <Box variant="p">
            Use application map to automatically discover and organize your services into groups based on your business
            needs. Identify root cause faster instead of troubleshooting isolated symptoms with operational signals such
            as SLOs, health indicators, and top insights in a contextual drawer.{' '}
            <Link variant="primary" href="#">
              Learn more
            </Link>
          </Box>
        </>
      ),
      contentCategory: <Badge>Operational investigations</Badge>,
      releaseDate: new Date('2025-08-01'),
    },
  ],
  mountItem: (container, data) => {
    mount(data, container);

    return () => unmount(container);
  },
  persistenceConfig: {
    uniqueKey: 'feature-notifications',
  },
  __persistFeatureNotifications: async function (
    persistenceConfig: FeatureNotificationsPersistenceConfig,
    value: Record<string, string>
  ) {
    const result = await new Promise<void>(resolve =>
      setTimeout(() => {
        localStorage.setItem(persistenceConfig.uniqueKey, JSON.stringify(value));
        resolve();
      }, 150)
    );
    return result;
  },
  __retrieveFeatureNotifications: async function (persistenceConfig: FeatureNotificationsPersistenceConfig) {
    const result = await new Promise<Record<string, string>>(resolve =>
      setTimeout(
        () =>
          resolve(
            localStorage.getItem(persistenceConfig.uniqueKey)
              ? JSON.parse(localStorage.getItem(persistenceConfig.uniqueKey)!)
              : {}
          ),
        150
      )
    );
    return result;
  },
});

type DemoContext = React.Context<
  AppContextType<{
    hasTools: boolean | undefined;
    hasDrawers: boolean | undefined;
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
  }>
>;

export default function () {
  const featurePromptRef = useRef<FeaturePromptProps.Ref>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const hasTools = urlParams.hasTools ?? false;

  useEffect(() => {
    const root = document.createElement('div');
    document.querySelector('#h a')?.remove();
    document.querySelector('#h')?.prepend(root);

    mount(
      <SpaceBetween direction="horizontal" size="xl">
        <Icon name="bug" id="bug-icon" />
        <Icon name="settings" id="settings-icon" />
      </SpaceBetween>,
      root
    );

    return () => {
      unmount(root);
    };
  }, []);

  return (
    <ScreenshotArea gutters={false}>
      <I18nProvider messages={[messages]} locale="en">
        <FeaturePrompt
          ref={featurePromptRef}
          onDismiss={() => {
            triggerRef.current?.focus();
          }}
          position="bottom"
          header={
            <Box fontWeight="bold">
              <Icon name="gen-ai" /> Our AI buddy is smarter than ever
            </Box>
          }
          content={
            <Box>
              It supports filtering with plain language, reports generation with .pdf, and so much more! See{' '}
              <Link href="#">top 10 things it can do for you</Link>.
            </Box>
          }
          getTrack={() => document.querySelector('#settings-icon')}
          trackKey="settings-icon"
        />
        <AppLayoutToolbar
          ariaLabels={labels}
          analyticsMetadata={{
            flowType: 'home',
            instanceIdentifier: 'demo-page',
          }}
          breadcrumbs={<Breadcrumbs />}
          navigation={<Navigation />}
          tools={<Tools>{toolsContent.long}</Tools>}
          toolsHide={!hasTools}
          content={
            <IframeWrapper
              id="feature-notifications"
              AppComponent={() => (
                <>
                  <div style={{ marginBlockEnd: '1rem' }}>
                    <Header variant="h1" description="Basic demo">
                      Demo page
                    </Header>
                  </div>
                  <Toggle checked={hasTools} onChange={({ detail }) => setUrlParams({ hasTools: detail.checked })}>
                    Use Tools
                  </Toggle>
                  <Box margin={{ top: 'm', bottom: 'm' }}>
                    <Container>
                      <SpaceBetween direction="horizontal" size="m">
                        <Button
                          ref={triggerRef}
                          onClick={() => {
                            featurePromptRef.current?.show();
                          }}
                        >
                          show a standalone feature prompt
                        </Button>
                        <Button
                          ref={triggerRef}
                          onClick={() => {
                            showFeaturePromptIfPossible();
                          }}
                        >
                          show a feature prompt for feature notifications
                        </Button>
                        <Button
                          ref={triggerRef}
                          onClick={() => {
                            localStorage.removeItem('feature-notifications');
                            window.location.reload();
                          }}
                        >
                          clean up persistence storage and reload the page
                        </Button>
                        <Button
                          ref={triggerRef}
                          onClick={() => {
                            clearFeatureNotifications();
                          }}
                        >
                          clear feature notifications
                        </Button>
                        <Button
                          onClick={() => {
                            registerFeatureNotifications({
                              id: 'local-feature-notifications',
                              suppressFeaturePrompt: false,
                              featuresPageLink: '/#/feature-notifications/feature-prompt?appLayoutToolbar=true',
                              filterFeatures: () => true,
                              features: [
                                {
                                  id: '1',
                                  header: <Box fontWeight="bold">Overriden</Box>,
                                  content: (
                                    <Box variant="p">
                                      You can now enrich CloudTrail events with additional information by adding
                                      resources tags and IAM global keys in CloudTrail lake.{' '}
                                      <Link variant="primary" external={true} href="https://amazon.com">
                                        Learn more
                                      </Link>
                                    </Box>
                                  ),
                                  releaseDate: new Date('2025-11-01'),
                                },
                              ],
                              mountItem: (container, data) => {
                                mount(data, container);

                                return () => unmount(container);
                              },
                              persistenceConfig: {
                                uniqueKey: 'feature-notifications',
                              },
                              // DON'T USE
                              ...{
                                __persistFeatureNotifications: async function (
                                  persistenceConfig: FeatureNotificationsPersistenceConfig,
                                  value: Record<string, string>
                                ) {
                                  const result = await new Promise<void>(resolve =>
                                    setTimeout(() => {
                                      localStorage.setItem(persistenceConfig.uniqueKey, JSON.stringify(value));
                                      resolve();
                                    }, 150)
                                  );
                                  return result;
                                },
                                __retrieveFeatureNotifications: async function (
                                  persistenceConfig: FeatureNotificationsPersistenceConfig
                                ) {
                                  const result = await new Promise<Record<string, string>>(resolve =>
                                    setTimeout(
                                      () =>
                                        resolve(
                                          localStorage.getItem(persistenceConfig.uniqueKey)
                                            ? JSON.parse(localStorage.getItem(persistenceConfig.uniqueKey)!)
                                            : {}
                                        ),
                                      150
                                    )
                                  );
                                  return result;
                                },
                              },
                            });
                          }}
                        >
                          Override
                        </Button>
                      </SpaceBetween>
                    </Container>
                  </Box>
                  <Containers />
                </>
              )}
            />
          }
        />
      </I18nProvider>
    </ScreenshotArea>
  );
}
