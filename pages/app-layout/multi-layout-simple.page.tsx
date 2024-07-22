// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import ScreenshotArea from '../utils/screenshot-area';
import { Containers, Navigation, Tools } from './utils/content-blocks';
import * as toolsContent from './utils/tools-content';
import labels from './utils/labels';

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
          <AppLayout
            data-testid="secondary-layout"
            ariaLabels={labels}
            navigationHide={true}
            content={<Containers />}
            tools={<Tools>{toolsContent.long}</Tools>}
          />
        }
      />
    </ScreenshotArea>
  );
}
