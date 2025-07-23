// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AppLayout, Button, Header, SpaceBetween } from '~components';

import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
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
