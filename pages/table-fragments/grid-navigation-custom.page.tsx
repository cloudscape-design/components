// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useMemo, useRef, useState } from 'react';
import SpaceBetween from '~components/space-between';
import { Box, Button, ColumnLayout, Container, FormField, Input, Link } from '~components';
import styles from './styles.scss';
import { id as generateId, generateItems, Instance } from '../table/generate-data';
import { useGridNavigation } from '~components/table/grid-navigation';
import AppContext, { AppContextType } from '../app/app-context';

type PageContext = React.Context<
  AppContextType<{
    pageSize: number;
  }>
>;

const createColumnDefinitions = ({
  onDelete,
  onDuplicate,
}: {
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}) => [
  {
    key: 'id',
    label: 'ID',
    render: (item: Instance) => item.id,
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (item: Instance) => (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
        <Button variant="inline-icon" iconName="remove" ariaLabel="Delete item" onClick={() => onDelete(item.id)} />
        <Button variant="inline-icon" iconName="copy" ariaLabel="Duplicate item" onClick={() => onDuplicate(item.id)} />
      </div>
    ),
  },
  { key: 'state', label: 'State', render: (item: Instance) => item.state },
  {
    key: 'imageId',
    label: 'Image ID',
    render: (item: Instance) => <Link>{item.imageId}</Link>,
  },
  { key: 'dnsName', label: 'DNS name', render: (item: Instance) => item.dnsName ?? '?' },
  { key: 'dnsName2', label: 'DNS name 2', render: (item: Instance) => (item.dnsName ?? '?') + ':2' },
  { key: 'dnsName3', label: 'DNS name 3', render: (item: Instance) => (item.dnsName ?? '?') + ':3' },
  { key: 'type', label: 'Type', render: (item: Instance) => item.type },
];

export default function Page() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const pageSize = urlParams.pageSize ?? 25;

  const [items, setItems] = useState(generateItems(25));
  const columnDefinitions = useMemo(
    () =>
      createColumnDefinitions({
        onDelete: (id: string) => setItems(prev => prev.filter(item => item.id !== id)),
        onDuplicate: (id: string) =>
          setItems(prev => prev.flatMap(item => (item.id !== id ? [item] : [item, { ...item, id: generateId() }]))),
      }),
    []
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const gridNavigationApi = useGridNavigation({
    getContainer: () => tableContainerRef.current,
    rows: items.length,
    columns: columnDefinitions.length,
    pageSize,
  });

  // TODO: use gridNavigationApi.focusCell
  console.log(gridNavigationApi);

  // TODO: add page buttons to increase/decrease amount of rows and columns

  return (
    <Box margin="l">
      <SpaceBetween size="l">
        <h1>Grid navigation with a custom table grid</h1>

        <ColumnLayout columns={3}>
          <FormField label="Page size">
            <Input
              type="number"
              value={pageSize.toString()}
              onChange={event => setUrlParams({ pageSize: parseInt(event.detail.value) })}
            />
          </FormField>
        </ColumnLayout>

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
