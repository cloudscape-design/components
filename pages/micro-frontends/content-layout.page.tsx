// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import { render } from 'react-dom';
import AppLayout from '~components/app-layout';
import ContentLayout from '~components/content-layout';
import Container from '~components/container';
import Flashbar from '~components/flashbar';
import Header from '~components/header';
import { Breadcrumbs } from '../app-layout/utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';
import appLayoutLabels from '../app-layout/utils/labels';
import { AppContext } from '~components/contexts/app-context';

export default function () {
  useEffect(() => {
    render(<SubApp />, document.getElementById('sub-app'));
  });
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        rootElementSelector="body"
        contentType="form"
        ariaLabels={appLayoutLabels}
        notifications={
          <Flashbar
            items={[
              {
                type: 'success',
                header: 'Success message',
                statusIconAriaLabel: 'success',
              },
            ]}
          />
        }
        breadcrumbs={<Breadcrumbs />}
        content={<div id="sub-app" />}
      />
    </ScreenshotArea>
  );
}

function SubApp() {
  return (
    <AppContext.Provider value={{ rootElement: 'body' }}>
      <ContentLayout>
        <Container
          header={
            <Header variant="h2" headingTagOverride="h1">
              Container header
            </Header>
          }
        >
          <div style={{ height: 400 }}>Test</div>
        </Container>
      </ContentLayout>
    </AppContext.Provider>
  );
}
