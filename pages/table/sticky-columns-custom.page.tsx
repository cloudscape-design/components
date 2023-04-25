// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import SpaceBetween from '~components/space-between';
import { Box, Link } from '~components';
import { useStickyState, StickyStateModel, useStickyStyles } from '~components/table/sticky-state-model';
import styles from './styles.scss';
import { generateItems } from './generate-data';
import clsx from 'clsx';

const items = generateItems(10);
const columnDefinitions = [
  { key: 'id', label: 'ID' },
  { key: 'state', label: 'State' },
  { key: 'type', label: 'Type' },
  { key: 'imageId', label: 'Image ID' },
  { key: 'dnsName', label: 'DNS name' },
];

export default function Page() {
  const stickyState = useStickyState({
    visibleColumns: columnDefinitions.map(column => column.key),
    stickyColumnsFirst: 1,
    stickyColumnsLast: 1,
  });

  return (
    <Box margin="l">
      <SpaceBetween size="xl">
        <h1>Sticky columns with a custom table</h1>

        <div ref={stickyState.refs.wrapper} className={styles['custom-table']} style={stickyState.style.wrapper}>
          <table ref={stickyState.refs.table} className={styles['custom-table-table']}>
            <thead>
              <tr>
                {columnDefinitions.map(column => (
                  <TableHeaderCell key={column.key} columnId={column.key} stickyState={stickyState}>
                    {column.label}
                  </TableHeaderCell>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  {columnDefinitions.map(column => (
                    <TableCell key={column.key} columnId={column.key} stickyState={stickyState}>
                      {column.key === 'imageId' ? (
                        <Link>{(item as any)[column.key] ?? '???'}</Link>
                      ) : (
                        (item as any)[column.key] ?? '???'
                      )}
                    </TableCell>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SpaceBetween>
    </Box>
  );
}

function TableCell({
  columnId,
  stickyState,
  children,
}: {
  columnId: string;
  stickyState: StickyStateModel;
  children: React.ReactNode;
}) {
  const stickyStyles = useStickyStyles({
    columnId,
    stickyState,
    getClassName: props => ({
      [styles['sticky-cell']]: !!props,
      [styles['sticky-cell-last-left']]: !!props?.lastLeft,
      [styles['sticky-cell-last-right']]: !!props?.lastRight,
    }),
  });
  return (
    <td
      ref={stickyStyles.ref}
      style={stickyStyles.style}
      className={clsx(styles['custom-table-cell'], stickyStyles.className)}
    >
      {children}
    </td>
  );
}

function TableHeaderCell({
  columnId,
  stickyState,
  children,
}: {
  columnId: string;
  stickyState: StickyStateModel;
  children: React.ReactNode;
}) {
  const stickyStyles = useStickyStyles({
    columnId,
    stickyState,
    getClassName: props => ({
      [styles['sticky-cell']]: !!props,
      [styles['sticky-cell-last-left']]: !!props?.lastLeft,
      [styles['sticky-cell-last-right']]: !!props?.lastRight,
    }),
  });
  return (
    <th
      ref={node => {
        stickyStyles.ref(node);
        stickyState.refs.headerCell(columnId, node);
      }}
      style={stickyStyles.style}
      className={clsx(styles['custom-table-cell'], stickyStyles.className)}
    >
      {children}
    </th>
  );
}
