// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppLayout,
  Button,
  ButtonDropdown,
  Checkbox,
  Container,
  ContentLayout,
  DatePicker,
  Header,
  Icon,
  Input,
  Link,
  Multiselect,
  Pagination,
  Popover,
  RadioGroup,
  SegmentedControl,
  Select,
  StatusIndicator,
  Toggle,
} from '~components';
import styles from './styles.scss';
import { generateItems, Instance } from '../table/generate-data';
import {
  getTableCellRoleProps,
  getTableColHeaderRoleProps,
  getTableHeaderRowRoleProps,
  getTableRoleProps,
  getTableRowRoleProps,
  getTableWrapperRoleProps,
  useGridNavigation,
} from '~components/table/table-role';
import { orderBy } from 'lodash';
import appLayoutLabels from '../app-layout/utils/labels';

const stateOptions = ['PENDING', 'RUNNING', 'STOPPING', 'STOPPED', 'TERMINATED', 'TERMINATING'].map(value => ({
  value,
  label: value,
}));

export default function Page() {
  const [items, setItems] = useState(generateItems(25));

  useEffect(() => {
    setInterval(() => {
      setItems(prev => [...prev, ...generateItems(1)]);
    }, 10000);
  }, []);

  const columnDefinitions = [
    {
      key: 'id',
      label: 'ID',
      render: (item: Instance) => <Link>{item.id}</Link>,
    },
    {
      key: 'actions-dropdown',
      label: 'Actions dropdown',
      render: () => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonDropdown
            ariaLabel="Item actions"
            variant="inline-icon"
            items={[
              { id: 'delete', text: 'Delete' },
              { id: 'duplicate', text: 'Duplicate' },
              { id: 'update', text: 'Update' },
            ]}
            onItemClick={() => {}}
            expandToViewport={true}
          />
        </div>
      ),
    },
    {
      key: 'actions-buttons',
      label: 'Actions buttons',
      render: () => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
          <Button variant="inline-icon" iconName="remove" ariaLabel="Delete item" />
          <Button variant="inline-icon" iconName="copy" ariaLabel="Duplicate item" />
          <Button variant="inline-icon" iconName="refresh" ariaLabel="Update item" />
        </div>
      ),
    },
    {
      key: 'state-select',
      label: 'State select',
      render: (item: Instance) => (
        <Select
          placeholder="Choose option"
          selectedOption={stateOptions.find(o => o.value === item.state) ?? null}
          options={stateOptions}
          expandToViewport={true}
        />
      ),
    },
    {
      key: 'state-multiselect',
      label: 'State multi-select',
      render: (item: Instance) => (
        <Multiselect
          placeholder="Choose option"
          selectedOptions={[stateOptions.find(o => o.value === item.state)!]}
          options={stateOptions}
          expandToViewport={true}
        />
      ),
    },
    {
      key: 'state-toggle',
      label: 'State toggle',
      render: (item: Instance) => (
        <Toggle checked={item.state === 'RUNNING'} onChange={() => {}}>
          On
        </Toggle>
      ),
    },
    {
      key: 'state-radio',
      label: 'State radio',
      render: (item: Instance) => (
        <RadioGroup
          value={item.state}
          onChange={() => {}}
          items={[
            { label: 'PENDING', value: 'PENDING' },
            { label: 'RUNNING', value: 'RUNNING' },
            { label: 'TERMINATED', value: 'TERMINATED' },
          ]}
        />
      ),
    },
    { key: 'dnsName-input', label: 'DNS name input', render: (item: Instance) => <Input value={item.dnsName ?? ''} /> },
    { key: 'date-picker', label: 'Date picker', render: () => <DatePicker value="" expandToViewport={true} /> },
    {
      key: 'type-popover',
      label: 'Type',
      render: (item: Instance) => (
        <Popover content={<Button>Action</Button>}>
          <StatusIndicator>{item.type}</StatusIndicator>
        </Popover>
      ),
    },
    {
      key: 'state-checks',
      label: 'Type checks',
      render: () => (
        <div>
          <Checkbox checked={false}>Fast</Checkbox>
          <Checkbox checked={false}>Faster</Checkbox>
        </div>
      ),
    },
    {
      key: 'pagination',
      label: 'Pagination',
      render: (item: Instance) => <Pagination currentPageIndex={0} pagesCount={Math.floor(item.state.length / 2)} />,
    },
    {
      key: 'state-segmented',
      label: 'State segmented',
      render: (item: Instance) => (
        <SegmentedControl
          selectedId={item.state === 'RUNNING' ? 'running' : 'not-running'}
          options={[
            { id: 'running', text: 'RUNNING' },
            { id: 'not-running', text: 'NOT RUNNING' },
          ]}
          onChange={() => {}}
        />
      ),
    },
  ];

  const [sortingKey, setSortingKey] = useState<null | string>(null);
  const [sortingDirection, setSortingDirection] = useState<1 | -1>(1);

  const tableRef = useRef<HTMLTableElement>(null);
  const tableRole = 'grid';

  useGridNavigation({ keyboardNavigation: true, pageSize: 10, getTable: () => tableRef.current });

  const sortedItems = useMemo(() => {
    if (!sortingKey) {
      return items;
    }
    return orderBy(items, [sortingKey], [sortingDirection === -1 ? 'desc' : 'asc']);
  }, [items, sortingKey, sortingDirection]);

  return (
    <AppLayout
      ariaLabels={appLayoutLabels}
      contentType="table"
      navigationHide={true}
      toolsOpen={false}
      content={
        <ContentLayout header={<Header variant="h1">Grid navigation with a custom table grid</Header>}>
          <Container
            disableContentPaddings={true}
            header={<Link data-testid="link-before">How to use grid navigation?</Link>}
            footer={<Link data-testid="link-after">How to use grid navigation?</Link>}
          >
            <div className={styles['custom-table']} {...getTableWrapperRoleProps({ tableRole, isScrollable: false })}>
              <table
                ref={tableRef}
                className={styles['custom-table-table']}
                {...getTableRoleProps({
                  tableRole,
                  totalItemsCount: items.length,
                  totalColumnsCount: columnDefinitions.length,
                })}
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
                          <button
                            className={styles['custom-table-sorting-header']}
                            onClick={() => {
                              if (sortingKey !== column.key) {
                                setSortingKey(column.key);
                                setSortingDirection(-1);
                              } else {
                                setSortingDirection(prev => (prev === 1 ? -1 : 1));
                              }
                            }}
                          >
                            {column.label}
                          </button>
                          {sortingKey === column.key && sortingDirection === -1 && <Icon name="angle-down" />}
                          {sortingKey === column.key && sortingDirection === 1 && <Icon name="angle-up" />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item, rowIndex) => (
                    <tr key={item.id} {...getTableRowRoleProps({ tableRole, rowIndex, firstIndex: 0 })}>
                      {columnDefinitions.map((column, colIndex) => (
                        <td
                          key={column.key}
                          className={styles['custom-table-cell']}
                          {...getTableCellRoleProps({ tableRole, colIndex })}
                        >
                          <div style={{ minWidth: 200 }}>{column.render(item)}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </ContentLayout>
      }
    />
  );
}
