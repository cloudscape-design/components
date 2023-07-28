// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import SpaceBetween from '~components/space-between';
import { Box, Container, Link } from '~components';
import styles from './styles.scss';
import { generateItems, Instance } from '../table/generate-data';
import { useGridNavigation } from '~components/table/grid-navigation';

const items = generateItems(50);
const columnDefinitions = [
  { key: 'id', label: 'ID', render: (item: Instance) => item.id },
  { key: 'state', label: 'State', render: (item: Instance) => item.state },
  { key: 'imageId', label: 'Image ID', render: (item: Instance) => <Link>{item.imageId}</Link> },
  { key: 'dnsName', label: 'DNS name', render: (item: Instance) => item.dnsName ?? 'none' },
  { key: 'dnsName2', label: 'DNS name 2', render: (item: Instance) => (item.dnsName ?? 'none') + ':2' },
  { key: 'type', label: 'Type', render: (item: Instance) => item.type },
];

export default function Page() {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const gridNavigationApi = useGridNavigation({
    getContainer: () => tableContainerRef.current,
    rows: items.length,
    columns: columnDefinitions.length,
    pageSize: 25,
  });

  // TODO: use gridNavigationApi.focusCell
  console.log(gridNavigationApi);

  // TODO: add page buttons to increase/decrease amount of rows and columns

  return (
    <Box margin="l">
      <SpaceBetween size="xl">
        <h1>Grid navigation with a custom table</h1>

        <Container disableContentPaddings={true}>
          <div ref={tableContainerRef} className={styles['custom-table']}>
            <table className={styles['custom-table-table']} role="grid">
              <thead>
                <tr>
                  {columnDefinitions.map(column => (
                    <TableColHeader key={column.key}>{column.label}</TableColHeader>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    {columnDefinitions.map(column => (
                      <TableCell key={column.key}>{column.render(item)}</TableCell>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </SpaceBetween>
    </Box>
  );
}

function TableColHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className={styles['custom-table-cell']} scope="col">
      {children}
    </th>
  );
}

function TableCell({ children }: { children: React.ReactNode }) {
  return (
    <td className={styles['custom-table-cell']} role="gridcell">
      {children}
    </td>
  );
}
