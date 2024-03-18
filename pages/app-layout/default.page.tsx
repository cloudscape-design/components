// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import ScreenshotArea from '../utils/screenshot-area';
import { Containers, Navigation, Tools, Breadcrumbs } from './utils/content-blocks';
import * as toolsContent from './utils/tools-content';
import labels from './utils/labels';
import { SplitPanel } from '~components';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        content={
          <>
            <AppLayout
              data-also-app-layout={true}
              tools={<Tools>{toolsContent.long}</Tools>}
              content={
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <Header variant="h1" description="Basic demo">
                      Demo page
                    </Header>
                  </div>
                  <Containers />

                  <AppLayout
                    splitPanel={
                      <SplitPanel header="Split panel header" i18nStrings={{}}>
                        Nothing to see here
                      </SplitPanel>
                    }
                  />
                </>
              }
            ></AppLayout>
          </>
        }
      />
    </ScreenshotArea>
  );
}
