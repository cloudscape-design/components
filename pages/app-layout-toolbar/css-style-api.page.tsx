// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayoutToolbar from '~components/app-layout-toolbar';
import Header from '~components/header';

import { Breadcrumbs, Containers, Navigation, Tools } from '../app-layout/utils/content-blocks';
import labels from '../app-layout/utils/labels';
import * as toolsContent from '../app-layout/utils/tools-content';
import ScreenshotArea from '../utils/screenshot-area';

import './css-style-api.css';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayoutToolbar
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        tools={<Tools>{toolsContent.long}</Tools>}
        content={
          <>
            <div style={{ marginBlockEnd: '1rem' }}>
              <Header variant="h1" description="Style API demo — nav trigger is purple, drawer trigger is blue.">
                CSS Style API
              </Header>
            </div>
            <Containers />
          </>
        }
      />
    </ScreenshotArea>
  );
}
