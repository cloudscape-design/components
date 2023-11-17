// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import Button from '~components/button';
import Box from '~components/box';
import { Instance, generateItems } from '../table/generate-data';
import { Checkbox, Link } from '~components';
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

const ITEMS_COUNT = 500;
const TEXT_COLUMNS_COUNT = 50;
const INTERACTIVE_COLUMNS_COUNT = 50;

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

function Table({ useGridNavigation: keyboardNavigation }: { useGridNavigation: boolean }) {
  const [items, setItems] = useState(generateItems(ITEMS_COUNT));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setItems(prev => [...prev, ...generateItems(1)]);
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const columnDefinitions = [
    ...range(0, TEXT_COLUMNS_COUNT).map(index => ({
      key: 'state' + index,
      label: 'State ' + (index + 1),
      render: (item: Instance) => item.state,
    })),
    ...range(0, INTERACTIVE_COLUMNS_COUNT).map(index => ({
      key: 'imageId' + index,
      label: 'Image ID ' + (index + 1),
      render: (item: Instance) => <Link>{item.imageId}</Link>,
    })),
  ];

  const tableRole = 'grid';
  const tableRef = useRef<HTMLTableElement>(null);

  useGridNavigation({ keyboardNavigation, pageSize: 10, getTable: () => tableRef.current });

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
                {...getTableColHeaderRoleProps({ tableRole, colIndex, keyboardNavigation })}
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
                  {...getTableCellRoleProps({ tableRole, colIndex, keyboardNavigation })}
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
