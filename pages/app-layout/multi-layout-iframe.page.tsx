// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
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
      content={<Containers />}
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
        content={<IframeWrapper id="inner-iframe" AppComponent={InnerApp} />}
      />
    </ScreenshotArea>
  );
}
