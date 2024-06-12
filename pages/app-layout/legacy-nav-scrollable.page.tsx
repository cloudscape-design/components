// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import Flashbar from '~components/flashbar';
import Header from '~components/header';
import ScreenshotArea from '../utils/screenshot-area';
import { Containers, Navigation, Tools, Breadcrumbs, Footer } from './utils/content-blocks';
import * as toolsContent from './utils/tools-content';
import labels from './utils/labels';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        disableBodyScroll={true}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        notifications={
          <Flashbar items={[{ type: 'success', header: 'Success message', statusIconAriaLabel: 'success' }]} />
        }
        stickyNotifications={true}
        tools={<Tools>{toolsContent.long}</Tools>}
        content={
          <>
            <div style={{ marginBlockEnd: '1rem' }}>
              <Header variant="h1" description="Uses scrollable container instead of body">
                Legacy AppLayout
              </Header>
            </div>
            <Containers />
          </>
        }
      />
      <Footer legacyConsoleNav={true} />
    </ScreenshotArea>
  );
}
