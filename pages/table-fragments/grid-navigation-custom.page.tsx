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
  { key: 'state', label: 'State', render: (item: Instance) => <Link>{item.imageId}</Link> },
  {
    key: 'imageId',
    label: 'Image ID',
    render: (item: Instance) => (
      <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
        <Link>{item.imageId.slice(0, 3)}</Link>
        <span>—</span>
        <Link>{item.imageId.slice(4, 7)}</Link>
        <span>—</span>
        <Link>{item.imageId.slice(6, 9)}</Link>
      </div>
    ),
  },
  { key: 'dnsName', label: 'DNS name', render: (item: Instance) => item.dnsName ?? '?' },
  { key: 'dnsName2', label: 'DNS name 2', render: (item: Instance) => (item.dnsName ?? '?') + ':2' },
  { key: 'dnsName3', label: 'DNS name 3', render: (item: Instance) => (item.dnsName ?? '?') + ':3' },
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
        <h1>Grid navigation with a custom table grid</h1>

        <Container
          disableContentPaddings={true}
          header={<Link>Focusable element before grid</Link>}
          footer={<Link>Focusable element after grid</Link>}
        >
          <div ref={tableContainerRef} className={styles['custom-table']} role="region" tabIndex={0}>
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
