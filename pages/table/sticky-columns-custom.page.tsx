// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import SpaceBetween from '~components/space-between';
import { Box, Checkbox, Container, Link } from '~components';
import { useMergeRefs } from '~components/internal/hooks/use-merge-refs';
import {
  useStickyColumns,
  useStickyCellStyles,
  useStickyBorderStyles,
  StickyColumnsModel,
} from '~components/table/use-sticky-columns';
import styles from './styles.scss';
import { generateItems, Instance } from './generate-data';
import clsx from 'clsx';
import { useContainerQuery } from '~components/internal/hooks/container-queries';

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
  const [tableHeight, tableRef] = useContainerQuery(entry => entry.borderBoxHeight);
  const mergedTableRef = useMergeRefs(tableRef, stickyColumns.refs.table);
  return (
    <Box margin="l">
      <SpaceBetween size="xl">
        <h1>Sticky columns with a custom table</h1>

        <Checkbox checked={useWrapperPaddings} onChange={event => setUseWrapperPaddings(event.detail.checked)}>
          Use wrapper paddings
        </Checkbox>

        <Container disableContentPaddings={true}>
          <div
            ref={stickyColumns.refs.wrapper}
            className={clsx(styles['custom-table'], useWrapperPaddings && styles['use-wrapper-paddings'])}
            style={stickyColumns.style.wrapper}
          >
            <StickyBorders stickyColumns={stickyColumns} tableHeight={tableHeight ?? 0} />

            <table
              ref={mergedTableRef}
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

function StickyBorders({ stickyColumns, tableHeight }: { stickyColumns: StickyColumnsModel; tableHeight: number }) {
  const stickyBorderStyles = useStickyBorderStyles({ stickyColumns });
  return (
    <>
      <div
        ref={stickyBorderStyles.leftBorderRef}
        style={{ ...stickyBorderStyles.leftBorderStyle, height: tableHeight, marginTop: -tableHeight }}
        className={styles['custom-table-sticky-border']}
      ></div>
      <div
        ref={stickyBorderStyles.rightBorderRef}
        style={{ ...stickyBorderStyles.rightBorderStyle, height: tableHeight, marginTop: -tableHeight }}
        className={styles['custom-table-sticky-border']}
      ></div>
    </>
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
      // [styles['sticky-cell-last-left']]: !!props?.lastLeft,
      // [styles['sticky-cell-last-right']]: !!props?.lastRight,
      // [styles['sticky-cell-pad-left']]: !!props?.padLeft,
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
