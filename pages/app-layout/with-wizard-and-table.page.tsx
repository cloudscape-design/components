// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useContext } from 'react';
import { AppLayout, Box, Button, ColumnLayout, Container, Header, SpaceBetween, Table, Wizard } from '~components';
import { columnsConfig } from '../table/shared-configs';
import { generateItems, Instance } from '../table/generate-data';
import labels from './utils/labels';
import { Breadcrumbs } from './utils/content-blocks';
import AppContext, { AppContextType } from '../app/app-context';

import ScreenshotArea from '../utils/screenshot-area';

type DemoContext = React.Context<
  AppContextType<{ hasBreadcrumbs: boolean; hasNotifications: boolean; disableOverlap: boolean }>
>;

const items = generateItems(20);

export default function () {
  const { urlParams } = useContext(AppContext as DemoContext);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        navigationHide={false}
        breadcrumbs={urlParams.hasBreadcrumbs && <Breadcrumbs />}
        content={
          <Wizard
            i18nStrings={{
              stepNumberLabel: stepNumber => `Step ${stepNumber}`,
              collapsedStepsLabel: (stepNumber, stepsCount) => `Step ${stepNumber} of ${stepsCount}`,
              skipToButtonLabel: step => `Skip to ${step.title}`,
              navigationAriaLabel: 'Steps',
              cancelButton: 'Cancel',
              previousButton: 'Previous',
              nextButton: 'Next',
              submitButton: 'Launch instance',
              optional: 'optional',
            }}
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
        contentType="wizard"
      />
    </ScreenshotArea>
  );
}
