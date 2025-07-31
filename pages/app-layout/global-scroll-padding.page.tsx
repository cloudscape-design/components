// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Button from '~components/button';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';
import ariaLabels from './utils/labels';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={ariaLabels}
        navigationHide={true}
        content={
          <div style={{ height: '200vh', border: '1px solid red' }}>
            <div style={{ marginBlockEnd: '1rem' }}>
              <Header data-testid="header" variant="h1">
                Focusable components
              </Header>
            </div>
            <SpaceBetween direction="vertical" size="xxl">
              <Button data-testid="button-1" ariaLabel="Button 1">
                Button 1
              </Button>
              <Button data-testid="button-2" ariaLabel="Button 2">
                Button 2
              </Button>
            </SpaceBetween>
          </div>
        }
      />
    </ScreenshotArea>
  );
}
