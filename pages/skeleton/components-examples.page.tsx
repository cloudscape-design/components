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
            <Checkbox checked={isLoading} onChange={({ detail }) => setIsLoading(detail.checked)}>
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

        {/* List Example */}
        <Container header={<Header variant="h2">List with Skeleton</Header>}>
          <List
            items={
              isLoading
                ? Array(4)
                    .fill(null)
                    .map((_, i) => ({ id: `loading-${i + 1}` }) as DataItem)
                : sampleData
            }
            renderItem={item =>
              isLoading
                ? {
                    id: item.id,
                    content: <Skeleton width="200px" />,
                    secondaryContent: <Skeleton width="50%" variant="text-body-s" display="inline-block" />,
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
                  This resource is operating within normal parameters. All health checks are passing and no issues have
                  been detected. The current configuration supports up to 1000 concurrent connections with automatic
                  scaling enabled.
                </>
              )}
            </Box>
          </SpaceBetween>
        </Container>

        {/* Text Content Skeleton */}
        <Container header={<Header variant="h2">Text Content with Skeleton</Header>}>
          <>
            <Header variant="h3">{isLoading ? <Skeleton width="200px" /> : 'Getting Started'}</Header>
            <Box variant="p">
              {isLoading ? (
                <>
                  <Skeleton />
                  <Skeleton width="88%" />
                </>
              ) : (
                <>
                  Welcome to the Skeleton component examples page. This page demonstrates how to use skeleton loading
                  states effectively across different components in your application. Skeleton screens help reduce
                  perceived loading time and minimize layout shift by showing placeholder content that matches the
                  structure of your actual content.
                </>
              )}
            </Box>
            <Header variant="h3">{isLoading ? <Skeleton width="200px" /> : 'Best Practices'}</Header>
            <Box variant="p">
              {isLoading ? (
                <>
                  <Skeleton />
                  <Skeleton width="88%" />
                </>
              ) : (
                <>
                  When implementing skeleton screens, ensure that the skeleton elements closely match the dimensions and
                  layout of your actual content. This prevents jarring layout shifts when the real content loads.
                </>
              )}
            </Box>
          </>
        </Container>
      </SpaceBetween>
    </Box>
  );
}
