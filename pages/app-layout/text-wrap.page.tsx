// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';

import ScreenshotArea from '../utils/screenshot-area';
import labels from './utils/labels';

const sidebarContent = 'Rechtsschutzversicherungsgesellschaften';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        content={<h1>Content</h1>}
        navigation={sidebarContent}
        navigationWidth={150}
        tools={sidebarContent}
        toolsOpen={true}
        toolsWidth={150}
        ariaLabels={labels}
      />
    </ScreenshotArea>
  );
}
