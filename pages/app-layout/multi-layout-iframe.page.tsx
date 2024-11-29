// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Button from '~components/button';
import Header from '~components/header';
import ScreenreaderOnly from '~components/internal/components/screenreader-only';
import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';
import Popover from '~components/popover';
import SpaceBetween from '~components/space-between';

import { IframeWrapper } from '../utils/iframe-wrapper';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Containers, Navigation, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import * as toolsContent from './utils/tools-content';

function InnerApp() {
  return (
    <AppLayout
      {...{ __disableRuntimeDrawers: true }}
      data-testid="secondary-layout"
      ariaLabels={labels}
      breadcrumbs={<Breadcrumbs />}
      navigationHide={true}
      content={
        <SpaceBetween size="s">
          <Header variant="h1" description="This page contains nested app layout instances with an iframe">
            Multiple app layouts with iframe
          </Header>

          <Link external={true} href="#">
            External link
          </Link>

          <Popover
            header="Network interface eth0"
            size="large"
            triggerType="custom"
            content={
              <KeyValuePairs
                columns={2}
                items={[
                  {
                    label: 'Interface ID',
                    value: (
                      <Link href="#" variant="primary">
                        eni-055da457bed9bbbe6
                      </Link>
                    ),
                  },
                  {
                    label: 'Private IP address',
                    value: '192.0.2.0',
                  },
                  { label: 'VPC ID', value: 'vpc-626163728' },
                  {
                    label: 'Private DNS name',
                    value: 'example.com',
                  },
                  {
                    label: 'Attachment owner',
                    value: 'vpc-626163728',
                  },
                  {
                    label: 'Public IP address',
                    value: '198.51.100.0',
                  },
                  {
                    label: 'Attached',
                    value: 'May 4, 2010, 04:56 (UTC+3:30)',
                  },
                  {
                    label: 'Source/Dest. check',
                    value: 'true',
                  },
                  {
                    label: 'Delete on terminate',
                    value: 'true',
                  },
                  { label: 'Description', value: '-' },
                ]}
              />
            }
          >
            <Button ariaLabel="metricInformation" iconName="status-info" variant="icon" />
          </Popover>

          <Containers />
        </SpaceBetween>
      }
      tools={<Tools>{toolsContent.long}</Tools>}
    />
  );
}

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        data-testid="main-layout"
        ariaLabels={labels}
        navigation={<Navigation />}
        toolsHide={true}
        disableContentPaddings={true}
        content={
          <>
            <ScreenreaderOnly>
              <h1>Multiple app layouts with iframe</h1>
            </ScreenreaderOnly>
            <IframeWrapper id="inner-iframe" AppComponent={InnerApp} />
          </>
        }
      />
    </ScreenshotArea>
  );
}
