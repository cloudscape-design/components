// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef } from 'react';
import { AppLayout, ContentLayout, Header } from '~components';
import { AppLayoutProps } from '~components/app-layout';
import appLayoutLabels from './utils/labels';
import { Breadcrumbs, Containers } from './utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';
import { drawerItems, drawerLabels } from './utils/drawers';

export default function WithDrawers() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(drawerItems[0].id);
  const appLayoutRef = useRef<AppLayoutProps.Ref>(null);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ref={appLayoutRef}
        ariaLabels={{ ...appLayoutLabels, ...drawerLabels }}
        breadcrumbs={<Breadcrumbs />}
        navigationHide={true}
        content={
          <ContentLayout
            data-test-id="content"
            //headerBackground="#000716"
            //highContrastHeader={true}
            header={
              <Header variant="h1" description="Sometimes you need custom drawers to get the job done.">
                One drawer opened
              </Header>
            }
          >
            <Containers />
          </ContentLayout>
        }
        drawers={drawerItems.slice(0, 2)}
        onDrawerChange={event => setActiveDrawerId(event.detail.activeDrawerId)}
        activeDrawerId={activeDrawerId}
      />
    </ScreenshotArea>
  );
}
