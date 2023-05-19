// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import AppLayout from '~components/app-layout';
import ContentLayout from '~components/content-layout';
import Container from '~components/container';
import Toggle from '~components/toggle';
import Flashbar from '~components/flashbar';
import Header from '~components/header';
import { Breadcrumbs } from '../app-layout/utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';
import appLayoutLabels from '../app-layout/utils/labels';

export default function () {
  const [hasBreadcrumbs, setHasBreadcrumbs] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [stickyNotifications, setStickyNotifications] = useState(true);
  const [disableOverlap, setDisableOverlap] = useState(false);
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        contentType="form"
        ariaLabels={appLayoutLabels}
        stickyNotifications={stickyNotifications}
        notifications={
          hasNotifications && (
            <Flashbar
              items={[
                {
                  type: 'success',
                  header: 'Success message',
                  statusIconAriaLabel: 'success',
                },
              ]}
            />
          )
        }
        breadcrumbs={hasBreadcrumbs && <Breadcrumbs />}
        content={
          <ContentLayout disableOverlap={disableOverlap}>
            <Container
              header={
                <Header variant="h2" headingTagOverride="h1">
                  Container header
                </Header>
              }
            >
              <Toggle
                checked={hasBreadcrumbs}
                onChange={() => setHasBreadcrumbs(!hasBreadcrumbs)}
                data-id="toggle-breadcrumbs"
              >
                Has breadcrumbs
              </Toggle>
              <Toggle
                checked={hasNotifications}
                onChange={() => setHasNotifications(!hasNotifications)}
                data-id="toggle-notifications"
              >
                Has notifications
              </Toggle>
              <Toggle checked={stickyNotifications} onChange={() => setStickyNotifications(!stickyNotifications)}>
                Sticky notifications
              </Toggle>
              <Toggle
                checked={disableOverlap}
                onChange={() => setDisableOverlap(!disableOverlap)}
                data-id="toggle-overlap"
              >
                Disable overlap
              </Toggle>
              <div style={{ height: 2000 }}></div>
            </Container>
          </ContentLayout>
        }
      />
    </ScreenshotArea>
  );
}
