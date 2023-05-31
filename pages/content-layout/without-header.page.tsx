// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useContext } from 'react';
import AppLayout from '~components/app-layout';
import ContentLayout from '~components/content-layout';
import Container from '~components/container';
import Toggle from '~components/toggle';
import Flashbar from '~components/flashbar';
import Header from '~components/header';
import { Breadcrumbs } from '../app-layout/utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';
import appLayoutLabels from '../app-layout/utils/labels';
import AppContext, { AppContextType } from '../app/app-context';

type DemoContext = React.Context<
  AppContextType<{ hasBreadcrumbs: boolean; hasNotifications: boolean; disableOverlap: boolean }>
>;

export default function () {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [stickyNotifications, setStickyNotifications] = useState(true);
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        contentType="form"
        ariaLabels={appLayoutLabels}
        stickyNotifications={stickyNotifications}
        notifications={
          <Flashbar
            items={
              urlParams.hasNotifications
                ? [
                    {
                      type: 'success',
                      header: 'Success message',
                      statusIconAriaLabel: 'success',
                    },
                  ]
                : []
            }
          />
        }
        breadcrumbs={urlParams.hasBreadcrumbs && <Breadcrumbs />}
        content={
          <ContentLayout disableOverlap={urlParams.disableOverlap}>
            <Container
              header={
                <Header variant="h2" headingTagOverride="h1">
                  Container header
                </Header>
              }
            >
              <Toggle
                checked={urlParams.hasBreadcrumbs}
                onChange={() => setUrlParams({ hasBreadcrumbs: !urlParams.hasBreadcrumbs })}
              >
                Has breadcrumbs
              </Toggle>
              <Toggle
                checked={urlParams.hasNotifications}
                onChange={() => setUrlParams({ hasNotifications: !urlParams.hasNotifications })}
              >
                Has notifications
              </Toggle>
              <Toggle checked={stickyNotifications} onChange={() => setStickyNotifications(!stickyNotifications)}>
                Sticky notifications
              </Toggle>
              <Toggle
                checked={urlParams.disableOverlap}
                onChange={() => setUrlParams({ disableOverlap: !urlParams.disableOverlap })}
              >
                Disable overlap
              </Toggle>
              <div style={{ height: 400 }}></div>
            </Container>
          </ContentLayout>
        }
      />
    </ScreenshotArea>
  );
}
