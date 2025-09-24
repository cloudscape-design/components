// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Alert from '~components/alert';
import Box from '~components/box';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import Table from '~components/table';
import { TableProps } from '~components/table';

interface TableItem {
  name: string;
  alt: string;
  description: React.ReactNode;
  type: string;
  size: string;
}

export default function InlineCodeExample() {
  return (
    <>
      <h1>Inline-code examples</h1>
      <Box padding={{ left: 'xl', right: 'xl', top: 'xxl', bottom: 'xl' }}>
        <SpaceBetween size="l">
          <div>
            <h2>Example usage in paragraph</h2>
            <p>
              When writing documentation, you can use inline code elements to highlight variables like{' '}
              <Box variant="awsui-inline-code">const myVariable = 42;</Box> or function names like{' '}
              <Box variant="awsui-inline-code">calculateTotal()</Box>. For example:{' '}
              <Box variant="awsui-inline-code">export API_ENDPOINT=&quot;https://api.example.com&quot;</Box>
            </p>
          </div>

          <div>
            <Table<TableItem>
              totalItemsCount={4}
              renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }: TableProps.LiveAnnouncement) =>
                `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
              }
              columnDefinitions={[
                {
                  id: 'variable',
                  header: 'Variable name',
                  cell: (item: TableItem) => <Link href="#">{item.name || '-'}</Link>,
                  sortingField: 'name',
                  isRowHeader: true,
                },
                {
                  id: 'alt',
                  header: 'Text value',
                  cell: (item: TableItem) => item.alt || '-',
                  sortingField: 'alt',
                },
                {
                  id: 'description',
                  header: 'Description',
                  cell: (item: TableItem) => item.description || '-',
                },
              ]}
              enableKeyboardNavigation={true}
              items={[
                {
                  name: 'Item 1',
                  alt: 'First',
                  description: (
                    <>
                      This is the first <Box variant="awsui-inline-code">db.t2.large</Box> item
                    </>
                  ),
                  type: '1A',
                  size: 'Small',
                },
                {
                  name: 'Item 2',
                  alt: 'Second',
                  description: (
                    <>
                      This is the second <Box variant="awsui-inline-code">S3-aws-phoenix.example.com</Box> item
                    </>
                  ),
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
              ]}
              loadingText="Loading resources"
              sortingDisabled={true}
              header={<Header> In table </Header>}
            />
          </div>

          <div>
            <h2>In Alert component</h2>
            <SpaceBetween size="xs">
              <Alert type="info" header="Configuration required">
                To configure your application, set the <Box variant="awsui-inline-code">API_ENDPOINT</Box> environment
                variable to your API URL.
              </Alert>

              <Alert type="warning" header="Deprecated function">
                The function <Box variant="awsui-inline-code">getUserData()</Box> is deprecated. Please use{' '}
                <Box variant="awsui-inline-code">fetchUserProfile()</Box> instead.
              </Alert>

              <Alert type="error" header="Deprecated version">
                The function <Box variant="awsui-inline-code">getUserData()</Box> is deprecated. Please use{' '}
                <Box variant="awsui-inline-code">fetchUserProfile()</Box> instead.
              </Alert>

              <Alert type="success" header="Versionset is set">
                The function <Box variant="awsui-inline-code">getUserData()</Box> is deprecated. Please use{' '}
                <Box variant="awsui-inline-code">fetchUserProfile()</Box> instead.
              </Alert>
            </SpaceBetween>
          </div>
        </SpaceBetween>
      </Box>
    </>
  );
}
