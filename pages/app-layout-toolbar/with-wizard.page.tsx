// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import {
  AppLayoutToolbar,
  Box,
  Button,
  ColumnLayout,
  Container,
  Header,
  SpaceBetween,
  Table,
  Wizard,
} from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { Breadcrumbs } from '../app-layout/utils/content-blocks';
import labels from '../app-layout/utils/labels';
import { generateItems, Instance } from '../table/generate-data';
import { columnsConfig } from '../table/shared-configs';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from '../wizard/common';

type DemoContext = React.Context<
  AppContextType<{ hasBreadcrumbs: boolean; hasNotifications: boolean; disableOverlap: boolean }>
>;

const items = generateItems(20);

export default function () {
  const { urlParams } = useContext(AppContext as DemoContext);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayoutToolbar
        contentType="wizard"
        ariaLabels={labels}
        navigationHide={false}
        breadcrumbs={urlParams.hasBreadcrumbs && <Breadcrumbs />}
        content={
          <Wizard
            i18nStrings={i18nStrings}
            onNavigate={({ detail }) => setActiveStepIndex(detail.requestedStepIndex)}
            activeStepIndex={activeStepIndex}
            allowSkipTo={true}
            steps={[
              {
                title: 'Add storage',
                content: (
                  <Box>
                    <Table<Instance>
                      header={
                        <Header
                          variant="awsui-h1-sticky"
                          description="Demo page with footer"
                          actions={<Button variant="primary">Create</Button>}
                        >
                          Sticky Scrollbar Example
                        </Header>
                      }
                      columnDefinitions={columnsConfig}
                      items={items}
                    />
                  </Box>
                ),
                isOptional: true,
              },
              {
                title: 'Review and launch',
                content: (
                  <SpaceBetween size="xs">
                    <Header variant="h3" actions={<Button onClick={() => setActiveStepIndex(0)}>Edit</Button>}>
                      Step 1: Instance type
                    </Header>
                    <Container header={<Header variant="h2">Container title</Header>}>
                      <ColumnLayout columns={2} variant="text-grid">
                        <div>
                          <Box variant="awsui-key-label">First field</Box>
                          <div>Value</div>
                        </div>
                        <div>
                          <Box variant="awsui-key-label">Second Field</Box>
                          <div>Value</div>
                        </div>
                      </ColumnLayout>
                    </Container>
                  </SpaceBetween>
                ),
              },
            ]}
          />
        }
      />
    </ScreenshotArea>
  );
}
