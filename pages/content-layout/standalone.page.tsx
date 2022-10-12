// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Button } from '~components';
import Alert from '~components/alert';
import ContentLayout from '~components/content-layout';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import { Containers } from '../app-layout/utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  const [alertVisible, setVisible] = useState(true);

  return (
    <main>
      <ScreenshotArea gutters={false}>
        <ContentLayout
          header={
            <div style={{ padding: '20px 40px 0' }}>
              <SpaceBetween size="m">
                <Header
                  variant="h1"
                  info={<Link>Info</Link>}
                  description="When you create a new distribution."
                  actions={<Button variant="primary">Create distribution</Button>}
                >
                  Create distribution
                </Header>
                {alertVisible && (
                  <Alert
                    statusIconAriaLabel="Info"
                    dismissible={true}
                    dismissAriaLabel="Close alert"
                    onDismiss={() => setVisible(false)}
                  >
                    Demo alert
                  </Alert>
                )}
              </SpaceBetween>
            </div>
          }
        >
          <div style={{ padding: '0 40px 20px' }}>
            <Containers />
          </div>
        </ContentLayout>
      </ScreenshotArea>
    </main>
  );
}
