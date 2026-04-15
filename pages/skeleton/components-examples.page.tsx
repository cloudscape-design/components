// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Cards from '~components/cards';
import Checkbox from '~components/checkbox';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import Header from '~components/header';
import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';
import List from '~components/list';
import Skeleton from '~components/skeleton';
import SpaceBetween from '~components/space-between';
import Table from '~components/table';

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

export default function SkeletonComponentsExamples() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Box padding="l">
      <div style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: 'white' }}>
        <Container>
          <SpaceBetween size="m">
            <Header
              variant="h2"
              description="Demonstrates skeleton loading patterns across different components to minimize layout shift"
            >
              Skeleton Component Examples
            </Header>
            <Checkbox
              checked={isLoading}
              onChange={({ detail }) => setIsLoading(detail.checked)}
            >
              Show loading state (Skeleton)
            </Checkbox>
          </SpaceBetween>
        </Container>
      </div>
      <SpaceBetween size="l">
        {/* Cards Example */}
        <Container header={<Header variant="h2">Cards with Skeleton</Header>}>
          <Cards
            cardDefinition={{
              header: item => (isLoading ? <Skeleton width="200px" variant="text-heading-m" /> : item.name),
              sections: [
                {
                  id: 'description',
                  header: 'Description',
                  content: item =>
                    isLoading ? <Skeleton variant="text-body-m" /> : (
                      item.description
                    ),
                },
                {
                  id: 'status',
                  header: 'Status',
                  content: item => (isLoading ? <Skeleton width="80px" variant="text-body-m" /> : item.status),
                  width: 50,
                },
                {
                  id: 'date',
                  header: 'Date',
                  content: item => (isLoading ? <Skeleton width="100px" variant="text-body-m" /> : item.date),
                  width: 50,
                },
              ],
            }}
            items={isLoading ? Array(4).fill({}) : sampleData}
            cardsPerRow={[{ cards: 1 }, { minWidth: 768, cards: 2 }]}
          />
        </Container>

        {/* Table Example */}
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

        {/* Key-Value Pairs Example */}
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
                          value: <Skeleton width="200px" variant="text-body-m" />,
                        },
                        {
                          label: 'Name',
                          value: <Skeleton width="180px" variant="text-body-m" />,
                        },
                        {
                          label: 'Type',
                          value: <Skeleton width="120px" variant="text-body-m" />,
                        },
                        {
                          label: 'Created',
                          value: <Skeleton width="150px" variant="text-body-m" />,
                        },
                      ],
                    },
                    {
                      type: 'group',
                      title: 'Configuration',
                      items: [
                        {
                          label: 'Region',
                          value: <Skeleton width="100px" variant="text-body-m" />,
                        },
                        {
                          label: 'Availability Zone',
                          value: <Skeleton width="80px" variant="text-body-m" />,
                        },
                        {
                          label: 'Status',
                          value: <Skeleton width="90px" variant="text-body-m" />,
                        },
                        {
                          label: 'Endpoint',
                          value: <Skeleton width="250px" variant="text-body-m" />,
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

        {/* List Example */}
        <Container header={<Header variant="h2">List with Skeleton</Header>}>
          <List
            items={isLoading ? Array(4).fill(null).map((_, i) => ({ id: `loading-${i + 1}` } as DataItem)) : sampleData}
            renderItem={item =>
              isLoading
                ? {
                    id: item.id,
                    content: <Skeleton width="200px" variant="text-body-m" />,
                    secondaryContent: <Skeleton width="50%" variant="text-body-s" display='inline-block' />,
                    actions: <Skeleton width="80px" variant="text-body-s" />,
                  }
                : {
                    id: item.id,
                    content: <Link fontSize="inherit">{item.name}</Link>,
                    secondaryContent: <Box variant="small">{item.description}</Box>,
                    actions: (
                      <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                        <Box variant="small">{item.date}</Box>
                        <Button variant="inline-icon" iconName="external" ariaLabel="Open" />
                      </SpaceBetween>
                    ),
                  }
            }
          />
        </Container>

        {/* Container with Complex Layout */}
        <Container
          header={
            isLoading ? (
              <Header variant="h2" description={<Skeleton width="250px" variant="text-body-m" />}>
                <Skeleton width="200px" variant="text-heading-m" />
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
                {isLoading ? <Skeleton width="80px" variant="text-display-l" /> : <Box fontSize="display-l">45%</Box>}
              </div>
              <div>
                <Box variant="awsui-key-label">Memory Usage</Box>
                {isLoading ? <Skeleton width="80px" variant="text-display-l" /> : <Box fontSize="display-l">62%</Box>}
              </div>
              <div>
                <Box variant="awsui-key-label">Network I/O</Box>
                {isLoading ? <Skeleton width="100px" variant="text-display-l" /> : <Box fontSize="display-l">1.2 GB/s</Box>}
              </div>
            </ColumnLayout>

            {isLoading ? (
              <SpaceBetween size="s">
                <Skeleton width="100%" variant="text-body-m" />
                <Skeleton width="100%" variant="text-body-m" />
                <Skeleton width="85%" variant="text-body-m" />
                <Skeleton width="90%" variant="text-body-m" />
              </SpaceBetween>
            ) : (
              <Box>
                <Box variant="p">
                  This resource is operating within normal parameters. All health checks are passing and no issues have
                  been detected. The current configuration supports up to 1000 concurrent connections with automatic
                  scaling enabled.
                </Box>
              </Box>
            )}
          </SpaceBetween>
        </Container>

        {/* Text Content Skeleton */}
        <Container header={<Header variant="h2">Text Content with Skeleton</Header>}>
          <SpaceBetween size="m">
            {isLoading ? (
              <>
                <Skeleton width="40%" variant="text-heading-m" />
                <SpaceBetween size="s">
                  <Skeleton width="100%" variant="text-body-m" />
                  <Skeleton width="100%" variant="text-body-m" />
                  <Skeleton width="95%" variant="text-body-m" />
                  <Skeleton width="88%" variant="text-body-m" />
                </SpaceBetween>
                <Skeleton width="35%" variant="text-heading-m" />
                <SpaceBetween size="s">
                  <Skeleton width="100%" variant="text-body-m" />
                  <Skeleton width="92%" variant="text-body-m" />
                </SpaceBetween>
              </>
            ) : (
              <>
                <Header variant="h3">Getting Started</Header>
                <Box variant="p">
                  Welcome to the Skeleton component examples page. This page demonstrates how to use skeleton loading
                  states effectively across different components in your application. Skeleton screens help reduce
                  perceived loading time and minimize layout shift by showing placeholder content that matches the
                  structure of your actual content.
                </Box>
                <Header variant="h3">Best Practices</Header>
                <Box variant="p">
                  When implementing skeleton screens, ensure that the skeleton elements closely match the dimensions and
                  layout of your actual content. This prevents jarring layout shifts when the real content loads.
                </Box>
              </>
            )}
          </SpaceBetween>
        </Container>

        {/* Multiple Containers Side by Side */}
        <ColumnLayout columns={2}>
          <Container header={isLoading ? <Skeleton width="150px" variant="text-heading-m" /> : <Header variant="h3">Summary</Header>}>
            {isLoading ? (
              <SpaceBetween size="m">
                <SpaceBetween size="xs">
                  <Skeleton width="100px" variant="text-body-s" />
                  <Skeleton width="150px" variant="text-heading-m" />
                </SpaceBetween>
                <SpaceBetween size="xs">
                  <Skeleton width="120px" variant="text-body-s" />
                  <Skeleton width="180px" variant="text-heading-m" />
                </SpaceBetween>
              </SpaceBetween>
            ) : (
              <SpaceBetween size="m">
                <div>
                  <Box variant="awsui-key-label">Total Resources</Box>
                  <Box fontSize="heading-xl" fontWeight="bold">
                    127
                  </Box>
                </div>
                <div>
                  <Box variant="awsui-key-label">Active Resources</Box>
                  <Box fontSize="heading-xl" fontWeight="bold">
                    103
                  </Box>
                </div>
              </SpaceBetween>
            )}
          </Container>

          <Container header={isLoading ? <Skeleton width="150px" variant="text-heading-m" /> : <Header variant="h3">Recent Activity</Header>}>
            {isLoading ? (
              <SpaceBetween size="s">
                {Array(3)
                  .fill(null)
                  .map((_, i) => (
                    <SpaceBetween size="xs" key={i}>
                      <Skeleton width="90%" variant="text-body-m" />
                      <Skeleton width="70px" variant="text-body-s" />
                    </SpaceBetween>
                  ))}
              </SpaceBetween>
            ) : (
              <SpaceBetween size="s">
                <div>
                  <Box>Database backup completed</Box>
                  <Box variant="small" color="text-status-inactive">
                    5 minutes ago
                  </Box>
                </div>
                <div>
                  <Box>New instance launched</Box>
                  <Box variant="small" color="text-status-inactive">
                    1 hour ago
                  </Box>
                </div>
                <div>
                  <Box>Security scan completed</Box>
                  <Box variant="small" color="text-status-inactive">
                    3 hours ago
                  </Box>
                </div>
              </SpaceBetween>
            )}
          </Container>
        </ColumnLayout>

        {/* Skeleton Variants */}
        <Container header={<Header variant="h2">Skeleton Variants & Customization</Header>}>
          <SpaceBetween size="l">
            <div>
              <Box variant="awsui-key-label">undefined (default, 3em height)</Box>
              <Skeleton />
            </div>
            <div>
              <Box variant="awsui-key-label">text-body-s</Box>
              <Skeleton variant="text-body-s" />
            </div>
            <div>
              <Box variant="awsui-key-label">text-body-m</Box>
              <Skeleton variant="text-body-m" />
            </div>
            <div>
              <Box variant="awsui-key-label">text-heading-xs</Box>
              <Skeleton variant="text-heading-xs" />
            </div>
            <div>
              <Box variant="awsui-key-label">text-heading-s</Box>
              <Skeleton variant="text-heading-s" />
            </div>
            <div>
              <Box variant="awsui-key-label">text-heading-m</Box>
              <Skeleton variant="text-heading-m" />
            </div>
            <div>
              <Box variant="awsui-key-label">text-heading-l</Box>
              <Skeleton variant="text-heading-l" />
            </div>
            <div>
              <Box variant="awsui-key-label">text-heading-xl</Box>
              <Skeleton variant="text-heading-xl" />
            </div>
            <div>
              <Box variant="awsui-key-label">text-display-l</Box>
              <Skeleton variant="text-display-l" />
            </div>
            <div>
              <Box variant="awsui-key-label">Custom Dimensions</Box>
              <Skeleton width="300px" height="100px" />
            </div>
            <div>
              <Box variant="awsui-key-label">Circular (Custom Border Radius)</Box>
              <Skeleton width="80px" height="80px" style={{ root: { borderRadius: '50%' } }} />
            </div>
            <div>
              <Box variant="awsui-key-label">Multiple Text Lines</Box>
              <SpaceBetween size="s">
                <Skeleton variant="text-body-m" width="100%" />
                <Skeleton variant="text-body-m" width="100%" />
                <Skeleton variant="text-body-m" width="75%" />
              </SpaceBetween>
            </div>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </Box>
  );
}
