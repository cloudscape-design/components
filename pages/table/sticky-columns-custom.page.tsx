// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useRef } from 'react';
import SpaceBetween from '~components/space-between';
import { Box } from '~components';
import { useStickyState, StickyStateModel, StickyStateCellStyles } from '~components/table/sticky-state-model';
import { useMergeRefs } from '~components/internal/hooks/use-merge-refs';
import styles from './styles.scss';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { generateItems } from './generate-data';
import { useReaction } from '~components/area-chart/model/async-store';
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
  const [wrapperWidth, wrapperQueryRef] = useContainerQuery(entry => entry.contentBoxWidth);
  const [tableWidth, tableQueryRef] = useContainerQuery(entry => entry.contentBoxWidth);
  const wrapperRefObject = useRef<HTMLDivElement>(null);
  const wrapperRef = useMergeRefs(wrapperQueryRef, wrapperRefObject);

  const stickyState = useStickyState({
    containerWidth: wrapperWidth ?? 0,
    tableWidth: tableWidth ?? 0,
    visibleColumns: columnDefinitions.map(column => column.key),
    stickyColumnsFirst: 1,
    stickyColumnsLast: 1,
    tablePaddingLeft: 0,
    tablePaddingRight: 0,
    wrapperRef: wrapperRefObject,
  });

  return (
    <Box margin="l">
      <SpaceBetween size="xl">
        <h1>Sticky columns with a custom table</h1>

        <div ref={wrapperRef} className={styles['custom-table']} onScroll={stickyState.handlers.onWrapperScroll}>
          <table ref={tableQueryRef} className={styles['custom-table-table']}>
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
                      {(item as any)[column.key] ?? '???'}
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

function useStickyStyles(columnId: string, stickyState: StickyStateModel) {
  const ref = useRef<HTMLElement>(null) as React.MutableRefObject<HTMLElement>;
  const refCallback = useCallback(node => {
    ref.current = node;
  }, []);

  const getClassName = (props: null | StickyStateCellStyles) => ({
    [styles['sticky-cell']]: !!props,
    [styles['sticky-cell-last-left']]: props?.lastLeft,
    [styles['sticky-cell-last-right']]: props?.lastRight,
  });

  useReaction(
    stickyState.store,
    state => state.cellStyles[columnId],
    props => {
      const className = getClassName(props);

      const cellElement = ref.current;
      if (cellElement) {
        Object.keys(className).forEach(key => {
          if (className[key]) {
            cellElement.classList.add(key);
          } else {
            cellElement.classList.remove(key);
          }
        });
        cellElement.style.left = props?.offset?.left !== undefined ? `${props?.offset?.left}px` : '';
        cellElement.style.right = props?.offset?.right !== undefined ? `${props?.offset?.right}px` : '';
      }
    }
  );

  return {
    ref: refCallback,
    className: clsx(getClassName(stickyState.store.get().cellStyles[columnId])),
    style: stickyState.store.get().cellStyles[columnId]?.offset ?? {},
  };
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
  const stickyStyles = useStickyStyles(columnId, stickyState);
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
  const stickyStyles = useStickyStyles(columnId, stickyState);
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
