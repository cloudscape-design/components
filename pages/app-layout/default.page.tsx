// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Header from '~components/header';

import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Containers, Navigation, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import * as toolsContent from './utils/tools-content';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
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
            <Containers />
          </>
        }
      />
    </ScreenshotArea>
  );
}
