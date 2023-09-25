// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { AppLayout, ContentLayout, Header, SplitPanel } from '~components';
import appLayoutLabels from './utils/labels';
import { Breadcrumbs, Containers } from './utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';

export default function WithDrawers() {
  const drawers = {
    drawers: {
      items: [],
    },
  };

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
          <SplitPanel
            header="Split panel header"
            i18nStrings={{
              preferencesTitle: 'Preferences',
              preferencesPositionLabel: 'Split panel position',
              preferencesPositionDescription: 'Choose the default split panel position for the service.',
              preferencesPositionSide: 'Side',
              preferencesPositionBottom: 'Bottom',
              preferencesConfirm: 'Confirm',
              preferencesCancel: 'Cancel',
              closeButtonAriaLabel: 'Close panel',
              openButtonAriaLabel: 'Open panel',
              resizeHandleAriaLabel: 'Slider',
            }}
          >
            This is the Split Panel!
          </SplitPanel>
        }
        {...drawers}
      />
    </ScreenshotArea>
  );
}
