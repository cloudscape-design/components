// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import { AppLayout, Badge, Box, Button, Header, Icon, Link, SpaceBetween } from '~components';
import { I18nProvider } from '~components/i18n';
import messages from '~components/i18n/messages/all.all';
import FeaturePrompt, { FeaturePromptProps } from '~components/internal/do-not-use/feature-prompt';
import {
  FeatureNotificationsPersistenceConfig,
  registerFeatureNotifications,
} from '~components/internal/plugins/widget';
import { mount, unmount } from '~mount';

import { Breadcrumbs, Containers, Navigation, Tools } from '../app-layout/utils/content-blocks';
import labels from '../app-layout/utils/labels';
import * as toolsContent from '../app-layout/utils/tools-content';
import ScreenshotArea from '../utils/screenshot-area';

registerFeatureNotifications({
  id: 'local-feature-notifications',
  suppressFeaturePrompt: false,
  featuresPageLink: '/new-amazing-features',
  filterFeatures: () => true,
  features: [
    {
      id: '1',
      header: <Box fontWeight="bold">New feature, events with more resource tags</Box>,
      content: (
        <Box variant="p">
          You can now enrich CloudTrail events with additional information by adding resources tags and IAM global keys
          in CloudTrail lake.{' '}
          <Link external={true} href="https://amazon.com">
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
            <Link external={true} href="https://amazon.com">
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
            as SLOs, health indicators, and top insights in a contextual drawer. <Link href="#">Learn more</Link>
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
    crossServicePersistence: false,
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
  },
});

export default function () {
  const featurePromptRef = useRef<FeaturePromptProps.Ref>(null);

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
            // handle focus behavior here
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
        <AppLayout
          ariaLabels={labels}
          analyticsMetadata={{
            flowType: 'home',
            instanceIdentifier: 'demo-page',
          }}
          breadcrumbs={<Breadcrumbs />}
          navigation={<Navigation />}
          tools={<Tools>{toolsContent.long}</Tools>}
          content={
            <>
              <div style={{ marginBlockEnd: '1rem' }}>
                <Header variant="h1" description="Basic demo">
                  Demo page
                </Header>
              </div>
              <Button
                onClick={() => {
                  featurePromptRef.current?.show();
                }}
              >
                show a feature prompt
              </Button>
              <Containers />
            </>
          }
        />
      </I18nProvider>
    </ScreenshotArea>
  );
}
