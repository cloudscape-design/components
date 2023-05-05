// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import SpaceBetween from '~components/space-between';
import { Box, Link } from '~components';
import { useStickyColumns, useStickyCellStyles, StickyColumnsModel } from '~components/table/use-sticky-columns';
import styles from './styles.scss';
import { generateItems, Instance } from './generate-data';
import clsx from 'clsx';

const items = generateItems(10);
const columnDefinitions = [
  { key: 'id', label: 'ID', render: (item: Instance) => item.id },
  { key: 'state', label: 'State', render: (item: Instance) => item.state },
  { key: 'type', label: 'Type', render: (item: Instance) => item.type },
  { key: 'imageId', label: 'Image ID', render: (item: Instance) => <Link>{item.imageId}</Link> },
  { key: 'dnsName', label: 'DNS name', render: (item: Instance) => item.dnsName },
];

export default function Page() {
  const stickyColumns = useStickyColumns({
    visibleColumns: columnDefinitions.map(column => column.key),
    stickyColumnsFirst: 1,
    stickyColumnsLast: 1,
  });
  return (
    <Box margin="l">
      <SpaceBetween size="xl">
        <h1>Sticky columns with a custom table</h1>

        <div ref={stickyColumns.refs.wrapper} className={styles['custom-table']} style={stickyColumns.style.wrapper}>
          <table ref={stickyColumns.refs.table} className={styles['custom-table-table']}>
            <thead>
              <tr>
                {columnDefinitions.map(column => (
                  <TableCell isHeader={true} key={column.key} columnId={column.key} stickyColumns={stickyColumns}>
                    {column.label}
                  </TableCell>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  {columnDefinitions.map(column => (
                    <TableCell isHeader={false} key={column.key} columnId={column.key} stickyColumns={stickyColumns}>
                      {column.render(item)}
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
  stickyColumns,
  children,
  isHeader,
}: {
  columnId: string;
  stickyColumns: StickyColumnsModel;
  children: React.ReactNode;
  isHeader: boolean;
}) {
  const Tag = isHeader ? 'th' : 'td';
  const stickyStyles = useStickyCellStyles({
    columnId,
    stickyColumns,
    getClassName: props => ({
      [styles['sticky-cell']]: !!props,
      [styles['sticky-cell-last-left']]: !!props?.lastLeft,
      [styles['sticky-cell-last-right']]: !!props?.lastRight,
    }),
  });
  return (
    <Tag
      ref={stickyStyles.ref}
      style={stickyStyles.style}
      className={clsx(styles['custom-table-cell'], stickyStyles.className)}
    >
      {children}
    </Tag>
  );
}
