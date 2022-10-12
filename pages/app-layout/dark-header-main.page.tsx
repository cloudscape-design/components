// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Button } from '~components';
import Alert from '~components/alert';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import { Breadcrumbs, Containers } from './utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';
import appLayoutLabels from './utils/labels';

export default function () {
  const [alertVisible, setVisible] = useState(true);
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        contentType="form"
        ariaLabels={appLayoutLabels}
        breadcrumbs={<Breadcrumbs />}
        contentHeader={
          <SpaceBetween size="m">
            <Header
              variant="h1"
              info={<Link>Info</Link>}
              description="When you create an Amazon CloudFront distribution."
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
        }
        content={<Containers />}
      />
    </ScreenshotArea>
  );
}
