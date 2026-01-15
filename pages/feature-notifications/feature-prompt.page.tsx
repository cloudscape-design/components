// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import { AppLayout, Box, Button, Header, Icon, Link, SpaceBetween } from '~components';
import FeaturePrompt, { FeaturePromptProps } from '~components/internal/do-not-use/feature-prompt';
import { mount, unmount } from '~mount';

import { Breadcrumbs, Containers, Navigation, Tools } from '../app-layout/utils/content-blocks';
import labels from '../app-layout/utils/labels';
import * as toolsContent from '../app-layout/utils/tools-content';
import ScreenshotArea from '../utils/screenshot-area';

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
      />
      <AppLayout
        ariaLabels={labels}
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
    </ScreenshotArea>
  );
}
