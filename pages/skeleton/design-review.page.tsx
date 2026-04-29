// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Cards from '~components/cards';
import Checkbox from '~components/checkbox';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import KeyValuePairs from '~components/key-value-pairs';
import Skeleton from '~components/skeleton';
import SpaceBetween from '~components/space-between';
import Table from '~components/table';
import Tabs from '~components/tabs';

import ScreenshotArea from '../utils/screenshot-area';

interface DataItem {
  id: string;
  name: string;
  description: string;
  status: string;
  date: string;
}

const sampleData: DataItem[] = [
  {
    id: 'item-1',
    name: 'Production Database',
    description: 'Primary production database instance with automated backups and high availability configuration',
    status: 'Active',
    date: '2026-04-15',
  },
  {
    id: 'item-2',
    name: 'Development Environment',
    description: 'Testing and development environment for new features',
    status: 'Active',
    date: '2026-04-14',
  },
  {
    id: 'item-3',
    name: 'Analytics Pipeline',
    description: 'Data processing pipeline for analytics and reporting',
    status: 'Pending',
    date: '2026-04-13',
  },
  {
    id: 'item-4',
    name: 'Backup Server',
    description: 'Secondary backup server for disaster recovery',
    status: 'Active',
    date: '2026-04-12',
  },
];

export default function SkeletonDesignReview() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ScreenshotArea>
      <Box padding="l">
        <div style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: 'white' }}>
          <Container>
            <SpaceBetween size="m">
              <Header
                variant="h2"
                description="Comprehensive visual design review for the Skeleton component across all variants with demo component integrations"
              >
                Skeleton Design Review
              </Header>
              <Checkbox checked={isLoading} onChange={({ detail }) => setIsLoading(detail.checked)}>
                Show loading state (Skeleton)
              </Checkbox>
            </SpaceBetween>
          </Container>
        </div>
        <SpaceBetween size="l">
          <Container header={<Header variant="h2">Variant Showcase</Header>}>
            <SpaceBetween size="m">
              <SpaceBetween size="xxs">
                <Box variant="awsui-key-label">text-body-s</Box>
                <Skeleton variant="text-body-s" width="100%" />
              </SpaceBetween>
              <SpaceBetween size="xxs">
                <Box variant="awsui-key-label">text-body-m</Box>
                <Skeleton variant="text-body-m" width="100%" />
              </SpaceBetween>
              <SpaceBetween size="xxs">
                <Box variant="awsui-key-label">text-heading-xs</Box>
                <Skeleton variant="text-heading-xs" width="100%" />
              </SpaceBetween>
              <SpaceBetween size="xxs">
                <Box variant="awsui-key-label">text-heading-s</Box>
                <Skeleton variant="text-heading-s" width="100%" />
              </SpaceBetween>
              <SpaceBetween size="xxs">
                <Box variant="awsui-key-label">text-heading-m</Box>
                <Skeleton variant="text-heading-m" width="100%" />
              </SpaceBetween>
              <SpaceBetween size="xxs">
                <Box variant="awsui-key-label">text-heading-l</Box>
                <Skeleton variant="text-heading-l" width="100%" />
              </SpaceBetween>
              <SpaceBetween size="xxs">
                <Box variant="awsui-key-label">text-heading-xl</Box>
                <Skeleton variant="text-heading-xl" width="100%" />
              </SpaceBetween>
              <SpaceBetween size="xxs">
                <Box variant="awsui-key-label">text-display-l</Box>
                <Skeleton variant="text-display-l" width="100%" />
              </SpaceBetween>
              <SpaceBetween size="xxs">
                <Box variant="awsui-key-label">default</Box>
                <Skeleton width="100%" />
              </SpaceBetween>
            </SpaceBetween>
          </Container>

          <Container
            header={
              <Header variant="h2" description="Default skeleton (no variant) inherits font-size from its parent">
                Font Size Inheritance
              </Header>
            }
          >
            <SpaceBetween size="m">
              <SpaceBetween size="xxs">
                <Box variant="awsui-key-label">Inside Box fontSize=&quot;body-s&quot;</Box>
                <Box fontSize="body-s">{isLoading ? <Skeleton width="100%" /> : 'Sample text at body-s size'}</Box>
              </SpaceBetween>
              <SpaceBetween size="xxs">
                <Box variant="awsui-key-label">Inside Box fontSize=&quot;body-m&quot;</Box>
                <Box fontSize="body-m">{isLoading ? <Skeleton width="100%" /> : 'Sample text at body-m size'}</Box>
              </SpaceBetween>
              <SpaceBetween size="xxs">
                <Box variant="awsui-key-label">Inside Box fontSize=&quot;heading-xs&quot;</Box>
                <Box fontSize="heading-xs">
                  {isLoading ? <Skeleton width="100%" /> : 'Sample text at heading-xs size'}
                </Box>
              </SpaceBetween>
              <SpaceBetween size="xxs">
                <Box variant="awsui-key-label">Inside Box fontSize=&quot;heading-s&quot;</Box>
                <Box fontSize="heading-s">
                  {isLoading ? <Skeleton width="100%" /> : 'Sample text at heading-s size'}
                </Box>
              </SpaceBetween>
              <SpaceBetween size="xxs">
                <Box variant="awsui-key-label">Inside Box fontSize=&quot;heading-m&quot;</Box>
                <Box fontSize="heading-m">
                  {isLoading ? <Skeleton width="100%" /> : 'Sample text at heading-m size'}
                </Box>
              </SpaceBetween>
              <SpaceBetween size="xxs">
                <Box variant="awsui-key-label">Inside Box fontSize=&quot;heading-l&quot;</Box>
                <Box fontSize="heading-l">
                  {isLoading ? <Skeleton width="100%" /> : 'Sample text at heading-l size'}
                </Box>
              </SpaceBetween>
              <SpaceBetween size="xxs">
                <Box variant="awsui-key-label">Inside Box fontSize=&quot;heading-xl&quot;</Box>
                <Box fontSize="heading-xl">
                  {isLoading ? <Skeleton width="100%" /> : 'Sample text at heading-xl size'}
                </Box>
              </SpaceBetween>
              <SpaceBetween size="xxs">
                <Box variant="awsui-key-label">Inside Box fontSize=&quot;display-l&quot;</Box>
                <Box fontSize="display-l">
                  {isLoading ? <Skeleton width="100%" /> : 'Sample text at display-l size'}
                </Box>
              </SpaceBetween>
            </SpaceBetween>
          </Container>

          <Container header={<Header variant="h2">Table with Skeleton Rows</Header>}>
            <Table
              columnDefinitions={[
                {
                  id: 'name',
                  header: 'Name',
                  cell: (item: DataItem) => item.name,
                },
                {
                  id: 'description',
                  header: 'Description',
                  cell: (item: DataItem) => item.description,
                },
                {
                  id: 'status',
                  header: 'Status',
                  cell: (item: DataItem) => item.status,
                },
                {
                  id: 'date',
                  header: 'Date',
                  cell: (item: DataItem) => item.date,
                },
              ]}
              items={isLoading ? [] : sampleData}
              loading={isLoading}
              skeleton={{ rows: 4 }}
              header={<Header>Resources</Header>}
              empty={<Box textAlign="center">No resources found</Box>}
            />
          </Container>

          <Container header={<Header variant="h2">Cards with Skeleton</Header>}>
            <Cards
              cardDefinition={{
                header: item => (isLoading ? <Skeleton width="200px" /> : item.name),
                sections: [
                  {
                    id: 'description',
                    header: 'Description',
                    content: item => (isLoading ? <Skeleton /> : item.description),
                  },
                  {
                    id: 'status',
                    header: 'Status',
                    content: item => (isLoading ? <Skeleton width="80px" /> : item.status),
                    width: 50,
                  },
                  {
                    id: 'date',
                    header: 'Date',
                    content: item => (isLoading ? <Skeleton width="100px" /> : item.date),
                    width: 50,
                  },
                ],
              }}
              items={isLoading ? Array(4).fill({}) : sampleData}
              cardsPerRow={[{ cards: 1 }, { minWidth: 768, cards: 2 }]}
            />
          </Container>

          <Container header={<Header variant="h2">Key-Value Pairs with Skeleton</Header>}>
            <KeyValuePairs
              columns={2}
              items={
                isLoading
                  ? [
                      {
                        type: 'group',
                        title: 'Resource Information',
                        items: [
                          {
                            label: 'Resource ID',
                            value: <Skeleton width="200px" />,
                          },
                          {
                            label: 'Name',
                            value: <Skeleton width="180px" />,
                          },
                          {
                            label: 'Type',
                            value: <Skeleton width="120px" />,
                          },
                          {
                            label: 'Created',
                            value: <Skeleton width="150px" />,
                          },
                        ],
                      },
                      {
                        type: 'group',
                        title: 'Configuration',
                        items: [
                          {
                            label: 'Region',
                            value: <Skeleton width="100px" />,
                          },
                          {
                            label: 'Availability Zone',
                            value: <Skeleton width="80px" />,
                          },
                          {
                            label: 'Status',
                            value: <Skeleton width="90px" />,
                          },
                          {
                            label: 'Endpoint',
                            value: <Skeleton width="250px" />,
                          },
                        ],
                      },
                    ]
                  : [
                      {
                        type: 'group',
                        title: 'Resource Information',
                        items: [
                          {
                            label: 'Resource ID',
                            value: 'res-abc123def456',
                          },
                          {
                            label: 'Name',
                            value: 'Production Database',
                          },
                          {
                            label: 'Type',
                            value: 'RDS Instance',
                          },
                          {
                            label: 'Created',
                            value: 'April 15, 2026',
                          },
                        ],
                      },
                      {
                        type: 'group',
                        title: 'Configuration',
                        items: [
                          {
                            label: 'Region',
                            value: 'us-east-1',
                          },
                          {
                            label: 'Availability Zone',
                            value: 'us-east-1a',
                          },
                          {
                            label: 'Status',
                            value: 'Available',
                          },
                          {
                            label: 'Endpoint',
                            value: 'db.example.us-east-1.rds.amazonaws.com',
                          },
                        ],
                      },
                    ]
              }
            />
          </Container>

          <Container
            header={
              isLoading ? (
                <Header variant="h2" description={<Skeleton width="250px" />}>
                  <Skeleton width="200px" />
                </Header>
              ) : (
                <Header variant="h2" description="Detailed resource information and metrics">
                  Resource Details
                </Header>
              )
            }
          >
            <SpaceBetween size="l">
              <ColumnLayout columns={3} variant="text-grid">
                <div>
                  <Box variant="awsui-key-label">CPU Utilization</Box>
                  <Box fontSize="display-l">{isLoading ? <Skeleton width="80px" /> : '45%'}</Box>
                </div>
                <div>
                  <Box variant="awsui-key-label">Memory Usage</Box>
                  <Box fontSize="display-l">{isLoading ? <Skeleton width="80px" /> : '62%'}</Box>
                </div>
                <div>
                  <Box variant="awsui-key-label">Network I/O</Box>
                  <Box fontSize="display-l">{isLoading ? <Skeleton width="80px" /> : '1.2 GB/s'}</Box>
                </div>
              </ColumnLayout>

              <Box variant="p">
                {isLoading ? (
                  <Skeleton />
                ) : (
                  <>
                    This resource is operating within normal parameters. All health checks are passing and no issues
                    have been detected. The current configuration supports up to 1000 concurrent connections with
                    automatic scaling enabled.
                  </>
                )}
              </Box>
            </SpaceBetween>
          </Container>

          <Container header={<Header variant="h2">ColumnLayout Metrics with Skeleton</Header>}>
            <ColumnLayout columns={3} variant="text-grid">
              <div>
                <Box variant="awsui-key-label">Requests/sec</Box>
                <Box fontSize="display-l">{isLoading ? <Skeleton width="80px" /> : '1,234'}</Box>
              </div>
              <div>
                <Box variant="awsui-key-label">Error Rate</Box>
                <Box fontSize="display-l">{isLoading ? <Skeleton width="80px" /> : '0.5%'}</Box>
              </div>
              <div>
                <Box variant="awsui-key-label">Latency</Box>
                <Box fontSize="display-l">{isLoading ? <Skeleton width="80px" /> : '45ms'}</Box>
              </div>
            </ColumnLayout>
          </Container>

          <Container header={<Header variant="h2">Tabs with Skeleton</Header>}>
            <Tabs
              tabs={[
                {
                  label: 'Overview',
                  id: 'overview',
                  content: isLoading ? (
                    <SpaceBetween size="s">
                      <Skeleton width="100%" />
                      <Skeleton width="85%" />
                      <Skeleton width="90%" />
                    </SpaceBetween>
                  ) : (
                    <Box variant="p">
                      This resource provides a comprehensive overview of the system architecture and current operational
                      status. All services are running within expected parameters with no active incidents reported.
                    </Box>
                  ),
                },
                {
                  label: 'Configuration',
                  id: 'configuration',
                  content: isLoading ? (
                    <SpaceBetween size="s">
                      <Skeleton width="95%" />
                      <Skeleton width="70%" />
                      <Skeleton width="80%" />
                    </SpaceBetween>
                  ) : (
                    <Box variant="p">
                      The current configuration includes auto-scaling policies, backup retention of 30 days, and
                      multi-AZ deployment for high availability. Encryption at rest is enabled using AWS KMS managed
                      keys.
                    </Box>
                  ),
                },
                {
                  label: 'Monitoring',
                  id: 'monitoring',
                  content: isLoading ? (
                    <SpaceBetween size="s">
                      <Skeleton width="90%" />
                      <Skeleton width="75%" />
                      <Skeleton width="85%" />
                    </SpaceBetween>
                  ) : (
                    <Box variant="p">
                      CloudWatch alarms are configured for CPU utilization, memory usage, and disk I/O. All metrics are
                      within normal thresholds. The last anomaly was detected 14 days ago and was automatically
                      resolved.
                    </Box>
                  ),
                },
              ]}
            />
          </Container>

          <Container header={<Header variant="h2">Form Fields with Skeleton</Header>}>
            <SpaceBetween size="m">
              <FormField label="Instance name">
                {isLoading ? <Skeleton width="100%" /> : <Input value="my-production-instance" readOnly={true} />}
              </FormField>
              <FormField label="Instance type">
                {isLoading ? <Skeleton width="100%" /> : <Input value="db.r5.xlarge" readOnly={true} />}
              </FormField>
              <FormField label="Region">
                {isLoading ? <Skeleton width="100%" /> : <Input value="us-east-1" readOnly={true} />}
              </FormField>
            </SpaceBetween>
          </Container>
        </SpaceBetween>
      </Box>
    </ScreenshotArea>
  );
}
