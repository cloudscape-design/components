// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, Container, ContentLayout, Header, ItemCard, SpaceBetween } from '~components';
import AppLayout from '~components/app-layout';
import ControlGroup from '~components/internal/components/control-group';

import labels from '../app-layout/utils/labels';
import ScreenshotArea from '../utils/screenshot-area';
import { input, select } from './common';

const controlGroup = (
  <ControlGroup actionButton={{ iconName: 'remove', ariaLabel: 'Remove' }}>
    {input}
    {select}
  </ControlGroup>
);

export default function ControlGroupSurfacesPage() {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        navigationHide={true}
        toolsHide={true}
        content={
          <ContentLayout header={<Header variant="h1">Control group on different surfaces</Header>}>
            <SpaceBetween size="l">
              <Box>
                <Header variant="h2">Layout content background</Header>
                {controlGroup}
              </Box>
              <Container header={<Header variant="h2">Container</Header>}>{controlGroup}</Container>
              <ItemCard header={<Header variant="h2">Item card</Header>}>{controlGroup}</ItemCard>
            </SpaceBetween>
          </ContentLayout>
        }
      />
    </ScreenshotArea>
  );
}
