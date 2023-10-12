// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import Button from '~components/button';
import Box from '~components/box';
import { Instance, generateItems } from '../table/generate-data';
import { ButtonDropdown, Checkbox, Link, StatusIndicator } from '~components';
import { stateToStatusIndicator } from '../table/shared-configs';
import { range } from 'lodash';
import {
  getTableCellRoleProps,
  getTableColHeaderRoleProps,
  getTableHeaderRowRoleProps,
  getTableRoleProps,
  getTableRowRoleProps,
  getTableWrapperRoleProps,
  useGridNavigation,
} from '~components/table/table-role';
import styles from './styles.scss';

const ITEMS_COUNT = 100;
const COLUMNS_COUNT = 50;

const items = generateItems(ITEMS_COUNT);

export default function Page() {
  const [isActive, setIsActive] = useState(false);
  const [useGridNavigation, setUseGridNavigation] = useState(false);
  return (
    <Box margin="m">
      <h1>Table grid navigation performance test</h1>

      <br />

      <Checkbox checked={useGridNavigation} onChange={event => setUseGridNavigation(event.detail.checked)}>
        Use grid navigation
      </Checkbox>

      <br />

      {isActive ? (
        <Table useGridNavigation={useGridNavigation} />
      ) : (
        <Button
          onClick={() => {
            setIsActive(true);
            console.time('render');
            requestAnimationFrame(() => console.timeEnd('render'));
          }}
        >
          Render Table
        </Button>
      )}
    </Box>
  );
}

function Table({ useGridNavigation: gridNavigationActive }: { useGridNavigation: boolean }) {
  const columnDefinitions = [
    {
      key: 'id',
      label: 'ID',
      render: (item: Instance) => item.id,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
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
      ),
    },
    {
      key: 'state',
      label: 'State',
      render: (item: Instance) => <StatusIndicator {...stateToStatusIndicator[item.state]} />,
    },
    {
      key: 'imageId',
      label: 'Image ID',
      render: (item: Instance) => <Link>{item.imageId}</Link>,
    },
    { key: 'type', label: 'Type', render: (item: Instance) => item.type },
    ...range(0, COLUMNS_COUNT - 5).map(index => ({
      key: `dnsName-${index}`,
      label: `DNS name ${index + 1}`,
      render: (item: Instance) => item.dnsName,
    })),
  ];

  const tableRole = 'grid';
  const tableRef = useRef<HTMLTableElement>(null);

  useGridNavigation({ active: gridNavigationActive, pageSize: 10, getTable: () => tableRef.current });

  return (
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
                {column.label}
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
  );
}
