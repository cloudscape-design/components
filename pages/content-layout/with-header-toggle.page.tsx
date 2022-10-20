// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Button } from '~components';
import Alert from '~components/alert';
import AppLayout from '~components/app-layout';
import ContentLayout from '~components/content-layout';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import { Breadcrumbs, Containers } from '../app-layout/utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';
import appLayoutLabels from '../app-layout/utils/labels';

export default function () {
  const [alertVisible, setVisible] = useState(true);
  const [renderHeader, setRenderHeader] = useState(true);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        contentType="form"
        ariaLabels={appLayoutLabels}
        breadcrumbs={
          <>
            <Breadcrumbs />{' '}
            <label style={{ color: 'white' }}>
              <input
                type="checkbox"
                id="header-present-checkbox"
                onChange={e => setRenderHeader(e.target.checked)}
                checked={renderHeader}
              />
              Render a header
            </label>
          </>
        }
        content={
          <ContentLayout
            header={
              renderHeader && (
                <SpaceBetween size="m">
                  <Header
                    variant="h1"
                    info={<Link>Info</Link>}
                    description="When you create a distribution."
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
              )
            }
          >
            <Containers />
          </ContentLayout>
        }
      />
    </ScreenshotArea>
  );
}
