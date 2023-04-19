// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import ScreenshotArea from '../utils/screenshot-area';
import { Containers, Navigation, Tools, Breadcrumbs } from './utils/content-blocks';
import labels from './utils/labels';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigationOpen={true}
        navigation={<Navigation />}
        toolsOpen={true}
        tools={<Tools>On mobile, tools panel displayed above navigation</Tools>}
        content={
          <>
            <div style={{ marginBottom: '1rem' }}>
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
