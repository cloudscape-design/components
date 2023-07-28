// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useMemo, useRef, useState } from 'react';
import SpaceBetween from '~components/space-between';
import { Box, Button, ColumnLayout, Container, FormField, Input, Link } from '~components';
import styles from './styles.scss';
import { id as generateId, generateItems, Instance } from '../table/generate-data';
import AppContext, { AppContextType } from '../app/app-context';
import {
  getTableCellRoleProps,
  getTableColHeaderRoleProps,
  getTableHeaderRowRoleProps,
  getTableRoleProps,
  getTableRowRoleProps,
  getTableWrapperRoleProps,
  useGridNavigation,
} from '~components/table/table-role';

type PageContext = React.Context<
  AppContextType<{
    pageSize: number;
  }>
>;

const createColumnDefinitions = ({
  onDelete,
  onDuplicate,
  onUpdate,
}: {
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onUpdate: (id: string) => void;
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
        <Button variant="inline-icon" iconName="refresh" ariaLabel="Update item" onClick={() => onUpdate(item.id)} />
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
  const pageSize = urlParams.pageSize ?? 10;

  const [items, setItems] = useState(generateItems(25));
  const columnDefinitions = useMemo(
    () =>
      createColumnDefinitions({
        onDelete: (id: string) => setItems(prev => prev.filter(item => item.id !== id)),
        onDuplicate: (id: string) =>
          setItems(prev => prev.flatMap(item => (item.id !== id ? [item] : [item, { ...item, id: generateId() }]))),
        onUpdate: (id: string) =>
          setItems(prev => prev.map(item => (item.id !== id ? item : { ...item, id: generateId() }))),
      }),
    []
  );

  const tableRef = useRef<HTMLTableElement>(null);

  const tableRole = 'grid';
  const gridNavigationApi = useGridNavigation({
    tableRole: 'grid',
    pageSize,
    getTable: () => tableRef.current,
  });

  // TODO: use gridNavigationApi.focusCell
  if (Math.random() > 1) {
    console.log(gridNavigationApi);
  }

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
          <div className={styles['custom-table']} {...getTableWrapperRoleProps({ tableRole, isScrollable: false })}>
            <table
              ref={tableRef}
              className={styles['custom-table-table']}
              {...getTableRoleProps({ tableRole, totalItemsCount: items.length })}
            >
              <thead>
                <tr {...getTableHeaderRowRoleProps({ tableRole })}>
                  {columnDefinitions.map((column, colIndex) => (
                    <th
                      key={column.key}
                      className={styles['custom-table-cell']}
                      {...getTableColHeaderRoleProps({ tableRole, colIndex })}
                    >
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
                        <div>{column.label}</div>
                        <Button variant="inline-icon" iconName="angle-down" ariaLabel="Sorting indicator" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, rowIndex) => (
                  <tr key={item.id} {...getTableRowRoleProps({ tableRole, rowIndex, firstIndex: 0 })}>
                    {columnDefinitions.map((column, colIndex) => (
                      <td
                        key={column.key}
                        className={styles['custom-table-cell']}
                        {...getTableCellRoleProps({ tableRole, colIndex })}
                      >
                        {column.render(item)}
                      </td>
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
