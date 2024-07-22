// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import ScreenreaderOnly from '~components/internal/components/screenreader-only';
import { Breadcrumbs, Containers, Navigation, Tools } from './utils/content-blocks';
import * as toolsContent from './utils/tools-content';
import { IframeWrapper } from './utils/iframe-wrapper';
import ScreenshotArea from '../utils/screenshot-area';
import labels from './utils/labels';

function InnerApp() {
  return (
    <AppLayout
      data-testid="secondary-layout"
      ariaLabels={labels}
      breadcrumbs={<Breadcrumbs />}
      navigationHide={true}
      content={
        <SpaceBetween size="s">
          <Header variant="h1" description="This page contains nested app layout instances with an iframe">
            Multiple app layouts with iframe
          </Header>
          <Containers />
        </SpaceBetween>
      }
      tools={<Tools>{toolsContent.long}</Tools>}
    />
  );
}

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        data-testid="main-layout"
        ariaLabels={labels}
        navigation={<Navigation />}
        toolsHide={true}
        disableContentPaddings={true}
        content={
          <>
            <ScreenreaderOnly>
              <h1>Multiple app layouts with iframe</h1>
            </ScreenreaderOnly>
            <IframeWrapper id="inner-iframe" AppComponent={InnerApp} />
          </>
        }
      />
    </ScreenshotArea>
  );
}
