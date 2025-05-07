// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AppLayout, ContentLayout, Header, SplitPanel } from '~components';

import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Containers } from './utils/content-blocks';
import appLayoutLabels from './utils/labels';
import { splitPaneli18nStrings } from './utils/strings';

export default function WithDrawers() {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={appLayoutLabels}
        breadcrumbs={<Breadcrumbs />}
        content={
          <ContentLayout
            header={
              <Header
                variant="h1"
                description="This page renders an empty drawers array, which should not occupy any space"
              >
                Page without drawers
              </Header>
            }
          >
            <Containers />
          </ContentLayout>
        }
        splitPanel={
          <SplitPanel header="Split panel header" i18nStrings={splitPaneli18nStrings}>
            This is the Split Panel!
          </SplitPanel>
        }
        drawers={[]}
      />
    </ScreenshotArea>
  );
}
