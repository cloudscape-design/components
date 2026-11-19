// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Header from '~components/header';
import ScreenreaderOnly from '~components/internal/components/screenreader-only';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';

import { IframeWrapper } from '../utils/iframe-wrapper';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Containers, Navigation, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import * as toolsContent from './utils/tools-content';

function InnerApp() {
  return (
    <AppLayout
      {...{ __disableRuntimeDrawers: true }}
      data-testid="secondary-layout"
      ariaLabels={labels}
      breadcrumbs={<Breadcrumbs />}
      navigationHide={true}
      content={
        <SpaceBetween size="s">
          <Header variant="h1" description="This page contains nested app layout instances with an iframe">
            Multiple app layouts with iframe
          </Header>

          <Link external={true} href="#">
            External link
          </Link>

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
