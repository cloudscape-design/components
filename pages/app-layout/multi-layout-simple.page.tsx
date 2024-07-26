// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Containers, Navigation, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import * as toolsContent from './utils/tools-content';

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
            breadcrumbs={<Breadcrumbs />}
            navigationHide={true}
            content={
              <SpaceBetween size="s">
                <Header variant="h1" description="This page contains nested app layout instances">
                  Multiple app layouts
                </Header>
                <Containers />
              </SpaceBetween>
            }
            tools={<Tools>{toolsContent.long}</Tools>}
          />
        }
      />
    </ScreenshotArea>
  );
}
