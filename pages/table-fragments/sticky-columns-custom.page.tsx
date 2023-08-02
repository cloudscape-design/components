// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import SpaceBetween from '~components/space-between';
import { Box, Checkbox, Container, Link } from '~components';
import {
  useStickyColumns,
  useStickyCellStyles,
  useStickyWrapperStyles,
  StickyColumnsModel,
} from '~components/table/sticky-columns';
import styles from './styles.scss';
import { generateItems, Instance } from '../table/generate-data';
import clsx from 'clsx';

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
  // When wrapper paddings are used there is no need in dynamic padLeft.
  const [useWrapperPaddings, setUseWrapperPaddings] = useState(false);
  const stickyColumns = useStickyColumns({
    visibleColumns: columnDefinitions.map(column => column.key),
    stickyColumnsFirst: 1,
    stickyColumnsLast: 1,
  });
  const stickyWrapperStyles = useStickyWrapperStyles(stickyColumns);
  return (
    <Box margin="l">
      <SpaceBetween size="xl">
        <h1>Sticky columns with a custom table</h1>

        <Checkbox checked={useWrapperPaddings} onChange={event => setUseWrapperPaddings(event.detail.checked)}>
          Use wrapper paddings
        </Checkbox>

        <Container disableContentPaddings={true}>
          <div
            ref={stickyWrapperStyles.ref}
            className={clsx(styles['custom-table'], useWrapperPaddings && styles['use-wrapper-paddings'])}
            style={stickyWrapperStyles.style}
          >
            <table
              ref={stickyColumns.refs.table}
              className={clsx(styles['custom-table-table'], useWrapperPaddings && styles['use-wrapper-paddings'])}
            >
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
        </Container>
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
      [styles['sticky-cell-pad-left']]: !!props?.padLeft,
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
