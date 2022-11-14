// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import {
  AppLayout,
  Box,
  Button,
  CollectionPreferences,
  ColumnLayout,
  Container,
  Header,
  Pagination,
  SpaceBetween,
  Table,
  TextFilter,
  Wizard,
} from '~components';
import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        navigationHide={false}
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
                    <Table
                      ariaLabels={{
                        selectionGroupLabel: 'Items selection',
                        allItemsSelectionLabel: ({ selectedItems }) =>
                          `${selectedItems.length} ${selectedItems.length === 1 ? 'item' : 'items'} selected`,
                        itemSelectionLabel: ({ selectedItems }, item) => {
                          const isItemSelected = selectedItems.filter(i => i.name === item.name).length;
                          return `${item.name} is ${isItemSelected ? '' : 'not'} selected`;
                        },
                      }}
                      columnDefinitions={[
                        {
                          id: 'variable',
                          header: 'Variable name',
                          cell: e => e.name,
                          sortingField: 'name',
                        },
                        {
                          id: 'value',
                          header: 'Text value',
                          cell: e => e.alt,
                          sortingField: 'alt',
                        },
                        { id: 'type', header: 'Type', cell: e => e.type },
                        {
                          id: 'description',
                          header: 'Description',
                          cell: e => e.description,
                        },
                      ]}
                      items={[
                        {
                          name: 'Item 1',
                          alt: 'First',
                          description: 'This is the first item',
                          type: '1A',
                          size: 'Small',
                          testing: 'hello',
                        },
                        {
                          name: 'Item 2',
                          alt: 'Second',
                          description: 'This is the second item',
                          type: '1B',
                          size: 'Large',
                        },
                        {
                          name: 'Item 3',
                          alt: 'Third',
                          description: '-',
                          type: '1A',
                          size: 'Large',
                        },
                        {
                          name: 'Item 4',
                          alt: 'Fourth',
                          description: 'This is the fourth item',
                          type: '2A',
                          size: 'Small',
                        },
                        {
                          name: 'Item 5',
                          alt: '-',
                          description:
                            'This is the fifth item with a longer description This is the fifth item with a longer description This is the fifth item with a longer description',
                          type: '2A',
                          size: 'Large',
                        },
                        {
                          name: 'Item 6',
                          alt: 'Sixth',
                          description: 'This is the sixth item',
                          type: '1A',
                          size: 'Small',
                        },
                      ]}
                      loadingText="Loading resources"
                      selectionType="multi"
                      trackBy="name"
                      visibleColumns={['variable', 'value', 'type', 'description']}
                      empty={
                        <Box textAlign="center" color="inherit">
                          <b>No resources</b>
                          <Box padding={{ bottom: 's' }} variant="p" color="inherit">
                            No resources to display.
                          </Box>
                          <Button>Create resource</Button>
                        </Box>
                      }
                      filter={<TextFilter filteringPlaceholder="Find resources" filteringText="" />}
                      header={<Header>Table with common features</Header>}
                      pagination={
                        <Pagination
                          currentPageIndex={1}
                          pagesCount={2}
                          ariaLabels={{
                            nextPageLabel: 'Next page',
                            previousPageLabel: 'Previous page',
                            pageLabel: pageNumber => `Page ${pageNumber} of all pages`,
                          }}
                        />
                      }
                      preferences={
                        <CollectionPreferences
                          title="Preferences"
                          confirmLabel="Confirm"
                          cancelLabel="Cancel"
                          preferences={{
                            pageSize: 10,
                            visibleContent: ['variable', 'value', 'type', 'description'],
                          }}
                          pageSizePreference={{
                            title: 'Select page size',
                            options: [
                              { value: 10, label: '10 resources' },
                              { value: 20, label: '20 resources' },
                            ],
                          }}
                          visibleContentPreference={{
                            title: 'Select visible content',
                            options: [
                              {
                                label: 'Main distribution properties',
                                options: [
                                  {
                                    id: 'variable',
                                    label: 'Variable name',
                                    editable: false,
                                  },
                                  { id: 'value', label: 'Text value' },
                                  { id: 'type', label: 'Type' },
                                  {
                                    id: 'description',
                                    label: 'Description',
                                  },
                                ],
                              },
                            ],
                          }}
                        />
                      }
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
